// A very lightweight in-browser assistant model implemented locally.
// It doesn't call any external service; it uses pattern matching and
// the existing bug detectors to provide helpful answers.

import { detectJavaScriptBugs } from './analyzers/js_analyzer.js';
import { detectCBugs } from './analyzers/c_analyzer.js';
import { detectPythonBugs } from './analyzers/py_analyzer.js';
import { detectJavaBugs } from './analyzers/java_analyzer.js';

export function freeChatResponse(message) {
    message = message.trim();
    if (!message) return "Please ask something.";

    // if message contains a code snippet (``` or lines with ; or {), run bugs detection
    if (message.includes('```') || /\n/.test(message) || /[;{}]/.test(message)) {
        // try each language
        let bugs = [];
        bugs.push(...detectJavaScriptBugs(message));
        bugs.push(...detectCBugs(message));
        bugs.push(...detectPythonBugs(message));
        bugs.push(...detectJavaBugs(message));
        if (bugs.length === 0) return "I didn't detect any obvious bugs in that snippet.";
        let reply = "I found the following potential issues:\n";
        bugs.forEach((b, i) => {
            reply += `${i+1}. ${b.title} - ${b.description}\n`;
        });
        return reply;
    }

    // simple conversational responses
    const lower = message.toLowerCase();
    if (lower.includes('hello') || lower.includes('hi')) return "Hello! How can I help you debug your code?";
    if (lower.includes('bug') || lower.includes('error')) return "Tell me the code or describe the problem, and I'll do my best to help.";
    if (lower.includes('thanks') || lower.includes('thank you')) return "You're welcome! Happy debugging.";
    if (lower.includes('help')) return "You can paste your code or ask me about common programming mistakes.";

    // fallback echo
    return "(free model) " + message;
}
