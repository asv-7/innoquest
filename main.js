import { detectJavaScriptBugs } from './analyzers/js_analyzer.js';
import { detectCBugs } from './analyzers/c_analyzer.js';
import { detectJavaBugs } from './analyzers/java_analyzer.js';
import { freeChatResponse } from './free_chatgpt.js'; // free built-in chat model


const samples = window.__samples__ || {};
let selectedLanguage = 'javascript';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('analyzeBtn').addEventListener('click', onAnalyzeClick);
    document.getElementById('clearBtn').addEventListener('click', clearCode);

    document.querySelectorAll('input[name="language"]').forEach(rb => rb.addEventListener('change', handleLanguageSelection));
    handleLanguageSelection();

    // mark Sign In as the default active header button
    try { switchLoginMode('signin'); } catch (e) { /* ignore if elements not present */ }


    // login/chat listeners
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
    // header top buttons open login panel and set mode
    const topSignIn = document.getElementById('topSigninBtn');
    const topSignUp = document.getElementById('topSignupBtn');
    if (topSignIn) topSignIn.addEventListener('click', () => { switchLoginMode('signin'); showLoginPanel(); });
    if (topSignUp) topSignUp.addEventListener('click', () => { switchLoginMode('signup'); showLoginPanel(); });
    document.getElementById('chatSendBtn').addEventListener('click', sendChatMessage);
    document.getElementById('chatInput').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } });
});

function handleLanguageSelection() {
    const checked = document.querySelector('input[name="language"]:checked');
    selectedLanguage = checked ? checked.value : '';
    const langNames = {'javascript': 'JavaScript', 'c': 'C Language', 'java': 'Java'};
    const selectedText = langNames[selectedLanguage] || 'None';
    document.getElementById('selectedLanguages').textContent = selectedText;
}

async function onAnalyzeClick() {
    const code = document.getElementById('codeInput').value.trim();
    if (!code) { alert('Please paste code!'); return; }
    if (!selectedLanguage) { alert('Select a language!'); return; }

    // Local detection
    const bugs = detectBugs(code, [selectedLanguage]);
    const explanations = generateExplanations(bugs, [selectedLanguage]);
    displayResults(bugs, explanations);

    // send to backend to actually compile/run and capture errors
    const serverRes = await runServerCode(code, selectedLanguage);
    displayServerResults(serverRes);
    return;
}

async function runServerCode(code, lang) {
    try {
        const resp = await fetch('/run', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({code, language: lang})
        });
        return await resp.json();
    } catch (e) {
        return {error: e.message};
    }
}

function displayServerResults(res) {
    const section = document.getElementById('executionSection');
    const output = document.getElementById('execOutput');
    if (!section || !output) return;
    section.style.display = 'block';
    let text = '';
    if (res.stdout) text += 'Output:\n' + res.stdout + '\n';

    if (res.error) {
        text += 'Error:\n' + res.error + '\n';
    }

    // structured linter results
    if (res.linterResults && Array.isArray(res.linterResults) && res.linterResults.length > 0) {
        text += 'Linter Results:\n';
        res.linterResults.forEach((it, i) => {
            const loc = it.file ? `${it.file}:${it.line}` : (it.line ? `line ${it.line}` : '');
            const sev = it.severity || it.level || it.severity === 2 ? (it.severity===2? 'error':'warning') : '';
            text += `${i+1}. ${loc} ${sev} ${it.message}\n`;
        });
    } else if (res.diagnostics && Array.isArray(res.diagnostics) && res.diagnostics.length > 0) {
        text += 'Diagnostics:\n';
        res.diagnostics.forEach((d, i) => {
            text += `${i+1}. ${d.message || d}\n`;
        });
    } else if (res.linter) {
        text += 'Linter:\n' + res.linter + '\n';
    } else if (res.stderr) {
        text += 'Errors:\n' + res.stderr.split('\n')[0] + '\n';
    }

    output.textContent = text || 'No output.';
}

let loginMode = 'signin'; // or 'signup'

function switchLoginMode(mode) {
    loginMode = mode;
    const signinBtn = document.getElementById('topSigninBtn');
    const signupBtn = document.getElementById('topSignupBtn');
    const header = document.getElementById('loginHeader');
    const loginBtn = document.getElementById('loginBtn');
    const emailInput = document.getElementById('loginEmail');

    if (mode === 'signin') {
        if (signinBtn) signinBtn.classList.add('active');
        if (signupBtn) signupBtn.classList.remove('active');
        header.textContent = 'Login for Free Assistant';
        loginBtn.textContent = 'Log In';
        emailInput.style.display = 'none';
    } else {
        if (signinBtn) signinBtn.classList.remove('active');
        if (signupBtn) signupBtn.classList.add('active');
        header.textContent = 'Create a Free Account';
        loginBtn.textContent = 'Sign Up';
        emailInput.style.display = 'block';
    }
}

function showLoginPanel() {
    const panel = document.getElementById('loginSection');
    if (panel) {
        panel.style.display = 'block';
        panel.scrollIntoView({behavior: 'smooth'});
    }
}

function handleLogin() {
    const user = document.getElementById('loginUsername').value.trim();
    const pass = document.getElementById('loginPassword').value;
    const email = document.getElementById('loginEmail').value.trim();
    if (!user || !pass) { alert('Enter username and password'); return; }
    if (loginMode === 'signup' && !email) { alert('Enter an email for signup'); return; }
    if (loginMode === 'signup') {
        alert('Account created! You are now logged in.');
    }
    // show chat
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('chatSection').style.display = 'block';
    appendChatMessage('system', `Welcome ${user}! You can now chat with the free model.`);
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;
    appendChatMessage('user', msg);
    input.value = '';
    const resp = freeChatResponse(msg);
    appendChatMessage('bot', resp);
}

function appendChatMessage(sender, text) {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'chat-message ' + sender;
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function detectBugs(code, languages = ['javascript']) {
    let bugs = [];
    languages.forEach(lang => {
        if (lang === 'javascript') bugs = bugs.concat(detectJavaScriptBugs(code));
        else if (lang === 'c') bugs = bugs.concat(detectCBugs(code));
        else if (lang === 'java') bugs = bugs.concat(detectJavaBugs(code));
    });
    // dedupe
    const unique = [];
    const seen = new Set();
    bugs.forEach(b => { const k = b.title + '|' + (b.code||''); if (!seen.has(k)) { seen.add(k); unique.push(b); } });
    return unique;
}

function generateExplanations(bugs, languages) {
    return bugs.map(b => ({title: '🤖 Analysis: ' + b.title, text: getExplanation(b, languages[0] || 'javascript')}));
}

function getExplanation(bug, lang) {
    const explanations = {
        "Missing Semicolon": {javascript: "Semicolons end statements. JS has ASI but be explicit.", c: "Every C statement needs ;.", python: "Python uses newline/indentation instead.", java: "Java statements need ;."},
        "Loose Equality (==)": {javascript: "== does type coercion. Use === for strict equality.", java: "Java is strongly typed.", python: "Use == for value, 'is' for identity."},
        "Variable Scope": {javascript: "let/const have block scope.", c: "Block scope applies to declarations in {}.", java: "Block scope like C.", python: "Function-level scope for variables."},
        "Array Out of Bounds": {c: "Indices 0..N-1 only. Off-by-one errors are common.", javascript: "Check array.length.", java: "Throws exception.", python: "Raises IndexError."},
        "Uninitialized Pointer": {c: "Pointers must point to valid memory before use.", java: "Use objects/reference types.", javascript: "No raw pointers.", python: "No raw pointers."},
        "Memory Leak": {c: "malloc without free causes leaks.", java: "Garbage collection helps.", javascript: "GC manages memory.", python: "GC manages memory."},
        "Infinite Loop": {javascript: "while(true) without break loops forever.", c: "Causes program to hang.", java: "Same.", python: "Same."},
        "Missing Colon": {python: "Python needs ':' after def/if/for/while.", javascript: "Not applicable.", c: "Not applicable.", java: "Not applicable."},
        "Range Off-by-One": {python: "range(n) -> 0..n-1. Be careful.", javascript: "Not applicable.", c: "Not applicable.", java: "Not applicable."},
        "Null Pointer Risk": {java: "Check for null before dereferencing.", c: "Check pointer validity.", python: "Check for None.", javascript: "Check for undefined/null."}
    };
    for (const key of Object.keys(explanations)) if (bug.title.includes(key)) return explanations[key][lang] || explanations[key]['javascript'] || bug.description;
    return bug.description || '';
}

function displayResults(bugs, explanations) {
    const bugsSection = document.getElementById('bugsSection');
    const bugsList = document.getElementById('bugsList');
    const expSection = document.getElementById('explanationsSection');
    const expList = document.getElementById('explanationsList');
    const successSection = document.getElementById('successSection');
    const execSection = document.getElementById('executionSection');

    bugsList.innerHTML = ''; expList.innerHTML = '';
    bugsSection.style.display = 'none'; expSection.style.display = 'none'; successSection.style.display = 'none';
    if (execSection) execSection.style.display = 'none';

    if (!bugs || bugs.length === 0) { successSection.style.display = 'block';
        // still show generic process
        showDebugProcess([]);
        return; }

    bugs.forEach((bug, i) => {
        bugsList.innerHTML += `<div class="bug-item"><div class="bug-title">Bug ${i+1}: ${bug.title}</div><div class="bug-description">${bug.description}</div><div class="bug-code">${bug.code || ''}</div><div class="fix-suggestion"><strong>✅ Fix:</strong> ${bug.fix || ''}</div></div>`;
    });
    bugsSection.style.display = 'block';

    explanations.forEach(exp => {
        expList.innerHTML += `<div class="explanation-item"><div class="explanation-title">${exp.title}</div><div class="explanation-text">${exp.text}</div></div>`;
    });
    if (explanations.length > 0) expSection.style.display = 'block';
    // show process after bugs listed
    showDebugProcess(bugs);
    setTimeout(() => bugsSection.scrollIntoView({behavior: 'smooth'}), 100);
}

function showDebugProcess(bugs) {
    const procSection = document.getElementById('processSection');
    const procList = document.getElementById('processList');
    if (!procSection || !procList) return;
    procList.innerHTML = '';
    const steps = [
        'Read the bug descriptions carefully.',
        'Locate the indicated lines or areas in your code.',
        'Understand what the code is supposed to do versus what it does.',
        'Apply the suggested fix or modify logic accordingly.',
        'Re-run the analysis or test your code to verify the issue is resolved.'
    ];
    // if specific bug titles available, add them as extra steps
    bugs.forEach((b, i) => {
        steps.push(`Review fix for: ${b.title}`);
    });
    steps.forEach(s => {
        const li = document.createElement('li');
        li.textContent = s;
        procList.appendChild(li);
    });
    procSection.style.display = 'block';
}


function clearCode() {
    const el = document.getElementById('codeInput');
    if (el) el.value = '';
    ['bugsSection','explanationsSection','successSection','executionSection'].forEach(id => { const e=document.getElementById(id); if(e) e.style.display='none'; });
    if (el) el.focus();
}

// Expose for legacy callers in the page (samples, buttons)
window.onAnalyzeClick = onAnalyzeClick;
window.analyzeCode = onAnalyzeClick;
