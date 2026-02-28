import flask as server
import tempfile, subprocess, os, json, re

# serve static frontend files from current directory
app = server.Flask(__name__, static_folder='.', static_url_path='')

@app.route('/')
def index():
    return server.send_from_directory('.', 'index.html')

@app.route('/run', methods=['POST'])
def run_code():
    data = server.request.get_json() or {}
    code = data.get('code', '')
    lang = data.get('language', '')
    if not code or not lang:
        return server.jsonify({'error': 'Missing code or language'}), 400

    try:
        if lang == 'javascript':
            # run via node and attempt ESLint analysis if available (JSON output)
            with tempfile.NamedTemporaryFile(suffix='.js', delete=False, mode='w') as f:
                f.write(code)
                fname = f.name
            linter_results = []
            try:
                lint = subprocess.run(['npx', 'eslint', '-f', 'json', fname], capture_output=True, text=True, timeout=6)
                if lint.stdout:
                    try:
                        parsed = json.loads(lint.stdout)
                        # parsed is an array; extract messages
                        if parsed and isinstance(parsed, list):
                            for file_report in parsed:
                                for msg in file_report.get('messages', []):
                                    linter_results.append({
                                        'ruleId': msg.get('ruleId'),
                                        'severity': msg.get('severity'),
                                        'message': msg.get('message'),
                                        'line': msg.get('line'),
                                        'column': msg.get('column')
                                    })
                    except Exception:
                        # fallback: keep raw output
                        linter_results = [{'message': lint.stdout}]
            except Exception:
                linter_results = []
            proc = subprocess.run(['node', fname], capture_output=True, text=True, timeout=6)
            os.unlink(fname)
            return server.jsonify({'stdout': proc.stdout, 'stderr': proc.stderr, 'linterResults': linter_results})
        elif lang == 'c':
            with tempfile.TemporaryDirectory() as d:
                src = os.path.join(d, 'prog.c')
                exe = os.path.join(d, 'prog')
                with open(src, 'w') as f:
                    f.write(code)
                # Prefer clang diagnostics in JSON if clang available, otherwise use gcc text diagnostics
                diagnostics = []
                try:
                    clang = subprocess.run(['clang', '-fsyntax-only', '-fno-color-diagnostics', '-fdiagnostics-format=json', src], capture_output=True, text=True, timeout=6)
                    if clang.stdout:
                        try:
                            diag_json = json.loads(clang.stdout)
                            # diag_json may contain 'diagnostics' key
                            for item in diag_json.get('diagnostics', []) if isinstance(diag_json, dict) else []:
                                diagnostics.append({'message': item.get('message', ''), 'level': item.get('level', '')})
                        except Exception:
                            # fallback to parsing stderr
                            if clang.stderr:
                                diagnostics.append({'message': clang.stderr})
                except Exception:
                    pass

                if not diagnostics:
                    # fallback to gcc text diagnostics
                    diag = subprocess.run(['gcc', '-Wall', '-Wextra', '-fsyntax-only', src], capture_output=True, text=True)
                    diag_text = diag.stderr or diag.stdout or ''
                    if diag_text:
                        diagnostics.append({'message': diag_text})

                comp = subprocess.run(['gcc', '-o', exe, src], capture_output=True, text=True)
                if comp.returncode != 0:
                    return server.jsonify({'error': comp.stderr, 'diagnostics': diagnostics})
                runp = subprocess.run([exe], capture_output=True, text=True, timeout=6)
                return server.jsonify({'stdout': runp.stdout, 'stderr': runp.stderr, 'diagnostics': diagnostics})
        elif lang == 'java':
            with tempfile.TemporaryDirectory() as d:
                src = os.path.join(d, 'Main.java')
                with open(src, 'w') as f:
                    f.write(code)
                # compile with linting warnings
                comp = subprocess.run(['javac', '-Xlint:all', src], capture_output=True, text=True)
                lint_output = comp.stderr or ''
                linter_results = []
                if lint_output:
                    # parse javac output lines like: Main.java:3: error: ';' expected
                    for line in lint_output.splitlines():
                        m = re.match(r"^(.*\.java):(\d+):\s*(warning|error):\s*(.*)$", line)
                        if m:
                            linter_results.append({'file': m.group(1), 'line': int(m.group(2)), 'severity': m.group(3), 'message': m.group(4)})
                        else:
                            if line.strip():
                                linter_results.append({'message': line.strip()})
                if comp.returncode != 0:
                    return server.jsonify({'error': comp.stderr, 'linterResults': linter_results})
                runp = subprocess.run(['java', '-cp', d, 'Main'], capture_output=True, text=True, timeout=6)
                return server.jsonify({'stdout': runp.stdout, 'stderr': runp.stderr, 'linterResults': linter_results})
        else:
            return server.jsonify({'error': 'Unsupported language'}), 400
    except subprocess.TimeoutExpired:
        return server.jsonify({'error': 'Execution timed out'}), 500
    except Exception as e:
        return server.jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
