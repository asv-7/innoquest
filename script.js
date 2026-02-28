// Sample Programs with Bugs
const samples = {
    1: {code: `function sumNumbers(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum = sum + i;
    }
    return sum
}`, title: "Sample 1 (JS): Missing Semicolon", bugs: [{title: "Missing Semicolon", description: "Return statement missing semicolon.", code: "return sum", fix: "return sum;"}], explanation: [{title: "🤖 AI: Semicolons", text: "Semicolons end statements. Always add them for safety."}]},
    2: {code: `function checkAge(age) {
    if (age >= 18) {
        let status = "Adult";
    }
    return status;
}`, title: "Sample 2 (JS): Variable Scope", bugs: [{title: "Variable Scope", description: "Variable defined in if block, used outside.", code: "let status = ...", fix: "Declare outside block"}], explanation: [{title: "🤖 AI: Scope", text: "let/const have block scope. Declare in outer scope if needed outside."}]},
    3: {code: `function findMax(arr) {
    let max = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}`, title: "Sample 3 (JS): Logic Error", bugs: [{title: "Wrong Max Init", description: "max=0 fails with negative arrays.", code: "let max = 0;", fix: "let max = arr[0]; or -Infinity;"}], explanation: [{title: "🤖 AI: Logic", text: "Don't assume fixed starting values. Use arr[0] or -Infinity."}]},
    4: {code: `function compare(a, b) {
    if (a == b) {
        return "Equal";
    }
    return "Not Equal";
}
console.log(compare(5, "5"));`, title: "Sample 4 (JS): Type Coercion", bugs: [{title: "Loose Equality (==)", description: "== does type coercion.", code: "if (a == b)", fix: "Use === for strict equality"}], explanation: [{title: "🤖 AI: Equality", text: "Always use === to avoid type coercion. 5 === '5' is false!"}]},
    5: {code: `#include <stdio.h>

int main() {
    int arr[5] = {10, 20, 30, 40, 50};
    
    for (int i = 0; i <= 5; i++) {
        printf("%d ", arr[i]);
    }
    return 0;
}`, title: "Sample 5 (C): Array Out of Bounds", bugs: [{title: "Array Out of Bounds", description: "Loop goes beyond valid indices.", code: "for (int i = 0; i <= 5; i++)", fix: "Use i < 5"}], explanation: [{title: "🤖 AI: Arrays", text: "Array size N has indices 0 to N-1. Off-by-one errors are classic bugs."}]},
    6: {code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int *ptr;
    
    *ptr = 10;
    printf("Value: %d\\n", *ptr);
    
    return 0;
}`, title: "Sample 6 (C): Uninitialized Pointer", bugs: [{title: "Uninitialized Pointer", description: "Pointer not pointing to valid memory.", code: "int *ptr; *ptr = 10;", fix: "int *ptr = malloc(sizeof(int));"}], explanation: [{title: "🤖 AI: Pointers", text: "Pointers must point to valid memory. Use malloc() or & before dereferencing."}]},
    7: {code: `#include <stdio.h>

int findSum(int n) {
    int sum = 0
    for (int i = 1; i <= n; i++) {
        sum = sum + i;
    }
    return sum;
}`, title: "Sample 7 (C): Missing Semicolon", bugs: [{title: "Missing Semicolon", description: "C requires semicolon after every statement.", code: "int sum = 0", fix: "int sum = 0;"}], explanation: [{title: "🤖 AI: C Syntax", text: "Every C statement ends with semicolon. Missing it causes compilation error."}]},
    8: {code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int *arr = malloc(100 * sizeof(int));
    
    for (int i = 0; i < 100; i++) {
        arr[i] = i * 2;
    }
    
    return 0;
}`, title: "Sample 8 (C): Memory Leak", bugs: [{title: "Memory Leak", description: "malloc without free wastes memory.", code: "malloc(...) without free", fix: "Add free(arr);"}], explanation: [{title: "🤖 AI: Memory", text: "Every malloc needs free. Not freeing causes memory leaks that crash programs."}]}
};

const videoResources = {
    javascript: [
        {title: "JavaScript Basics", description: "Variables, loops, functions.", duration: "4 hours", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg"},
        {title: "Complete JS Course", description: "ES6+, async/await, DOM.", duration: "35 hours", url: "https://www.youtube.com/watch?v=jS4aFq5-91o"},
        {title: "DOM Manipulation", description: "Interactive web apps.", duration: "6 hours", url: "https://www.youtube.com/watch?v=0ik6X7EL_4o"},
        {title: "Debugging Guide", description: "Browser dev tools.", duration: "3 hours", url: "https://www.youtube.com/watch?v=VqIQuFxWLww"}
    ],
    c: [
        {title: "C Basics", description: "Syntax, pointers, memory.", duration: "15 hours", url: "https://www.youtube.com/watch?v=KJgsSFOSQv0"},
        {title: "Pointers Mastery", description: "Memory and addresses.", duration: "8 hours", url: "https://www.youtube.com/watch?v=W0aE-w61Cb8"},
        {title: "Memory Management", description: "malloc, calloc, free.", duration: "6 hours", url: "https://www.youtube.com/watch?v=BwIYt2x0Ygc"},
        {title: "C Debugging", description: "gdb and valgrind.", duration: "4 hours", url: "https://www.youtube.com/watch?v=2wSLlByCbp4"}
    ],
    python: [
        {title: "Python Basics", description: "Variables, loops, OOP.", duration: "10 hours", url: "https://www.youtube.com/watch?v=_uQrJ0TkSuc"},
        {title: "Advanced Python", description: "Decorators, generators.", duration: "30 hours", url: "https://www.youtube.com/watch?v=rfscVS0vtik"},
        {title: "Debugging Python", description: "pdb, logging.", duration: "4 hours", url: "https://www.youtube.com/watch?v=5AYIicFvjQ0"},
        {title: "Performance Tuning", description: "Profiling, optimization.", duration: "5 hours", url: "https://www.youtube.com/watch?v=d1sQKfbCz3E"}
    ],
    java: [
        {title: "Java Fundamentals", description: "Classes, inheritance, OOP.", duration: "20 hours", url: "https://www.youtube.com/watch?v=xk4_1vDrzzo"},
        {title: "Advanced OOP", description: "Design patterns.", duration: "15 hours", url: "https://www.youtube.com/watch?v=qhl8aiRCvzc"},
        {title: "Java Debugging", description: "JVM, IDE tools.", duration: "6 hours", url: "https://www.youtube.com/watch?v=O0QLZ5Wy0C4"},
        {title: "Collections", description: "ArrayList, HashMap.", duration: "8 hours", url: "https://www.youtube.com/watch?v=KdfrUUBJJp8"}
    ]
};

let selectedLanguage = 'javascript';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('analyzeBtn').addEventListener('click', analyzeCode);
    document.getElementById('clearBtn').addEventListener('click', clearCode);
    
    const radios = document.querySelectorAll('input[name="language"]');
    radios.forEach(rb => rb.addEventListener('change', handleLanguageSelection));
    
    const videosSection = document.getElementById('videosSection');
    if (videosSection) videosSection.style.display = 'block';
    
    setTimeout(() => showVideos('javascript'), 100);
});

function handleLanguageSelection() {
    const checked = document.querySelector('input[name="language"]:checked');
    selectedLanguage = checked ? checked.value : '';
    const langNames = {'javascript': 'JavaScript', 'c': 'C Language', 'python': 'Python', 'java': 'Java'};
    const selectedText = langNames[selectedLanguage] || 'None';
    document.getElementById('selectedLanguages').textContent = selectedText;
}

function showVideos(language) {
    const grid = document.getElementById('videosGrid');
    grid.innerHTML = '';
    
    const videos = videoResources[language] || [];
    videos.forEach(video => {
        grid.innerHTML += `<div class="video-card"><div class="video-thumbnail">▶️</div><div class="video-info"><div class="video-title">${video.title}</div><div class="video-description">${video.description}</div><div class="video-duration">⏱️ ${video.duration}</div><a href="${video.url}" target="_blank" class="video-link">Watch on YouTube</a></div></div>`;
    });
    
    document.querySelectorAll('.video-lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(language.split(' ')[0])) btn.classList.add('active');
    });
}

function loadSample(num) {
    const sample = samples[num];
    document.getElementById('codeInput').value = sample.code;
    setTimeout(() => analyzeCode(num), 100);
}

function analyzeCode(sampleNum = null) {
    const code = document.getElementById('codeInput').value.trim();
    if (!code) { alert('Please paste code!'); return; }
    if (!selectedLanguage) { alert('Select a language!'); return; }
    
    if (sampleNum && samples[sampleNum]) {
        displayResults(samples[sampleNum].bugs, samples[sampleNum].explanation);
        return;
    }
    
    const bugs = detectBugs(code, [selectedLanguage]);
    const explanations = generateExplanations(bugs, [selectedLanguage]);
    displayResults(bugs, explanations);
}

import { detectJavaScriptBugs } from './analyzers/js_analyzer.js';
import { detectCBugs } from './analyzers/c_analyzer.js';
import { detectPythonBugs } from './analyzers/py_analyzer.js';
import { detectJavaBugs } from './analyzers/java_analyzer.js';

function detectBugs(code, languages = ['javascript']) {
    const bugs = [];
    languages.forEach(lang => {
        if (lang === 'javascript') bugs.push(...detectJavaScriptBugs(code));
        else if (lang === 'c') bugs.push(...detectCBugs(code));
        else if (lang === 'python') bugs.push(...detectPythonBugs(code));
        else if (lang === 'java') bugs.push(...detectJavaBugs(code));
    });

    const unique = [];
    const seen = new Set();
    bugs.forEach(bug => {
        const key = bug.title + bug.code;
        if (!seen.has(key)) { seen.add(key); unique.push(bug); }
    });
    return unique;
}

function generateExplanations(bugs, languages = ['javascript']) {
    const expl = [];
    bugs.forEach(bug => {
        expl.push({title: "🤖 AI Analysis: " + bug.title, text: getExplanation(bug, languages[0])});
    });
    return expl;
}

function getExplanation(bug, lang) {
    const explanations = {
        "Missing Semicolon": {javascript: "Semicolons end statements. JS has auto-insertion but always add manually for safety.", c: "EVERY C statement needs ;", python: "Python doesn't use ; at line ends.", java: "All Java statements need ;"},
        "Loose Equality (==)": {javascript: "== does type coercion! 5 == '5' is true. Use === for strict checking.", java: "Strong typing prevents this.", python: "== is okay; use 'is' for identity."},
        "Variable Scope": {javascript: "let/const have block scope. var has function scope.", c: "Variables in {} are block-scoped.", java: "Block scope like C.", python: "No block scope."},
        "Array Out of Bounds": {c: "arr[n] of size n is invalid. Only 0 to n-1. Off-by-one error!", javascript: "Check length.", java: "Throws exception.", python: "Auto-grow."},
        "Uninitialized Pointer": {c: "Pointers must point to valid memory. malloc() or &.", java: "No manual pointers.", javascript: "No pointers.", python: "No pointers."},
        "Memory Leak": {c: "Every malloc needs free(). Not freeing wastes memory and crashes.", java: "GC handles.", javascript: "GC handles.", python: "GC handles."},
        "Infinite Loop": {javascript: "while(true) never stops. Add break or fix condition.", java: "Same issue.", c: "Causes freeze.", python: "Same."},
        "Missing Colon": {python: "Python needs : after if/for/while/def. Essential!", java: "Not needed.", c: "Not needed.", javascript: "Not needed."},
        "Range Off-by-One": {python: "range(5) gives 0,1,2,3,4 - NOT 5! Common mistake.", java: "Not applicable.", c: "Not applicable.", javascript: "Not applicable."},
        "Null Pointer Risk": {java: "Objects can be null. Always check with != null.", c: "Check pointers.", python: "Check None.", javascript: "Check undefined."}
    };
    
    for (const [key, langs] of Object.entries(explanations)) {
        if (bug.title.includes(key)) return langs[lang] || langs['javascript'] || bug.description;
    }
    return `${lang} issue: ${bug.description}`;
}

function displayResults(bugs, explanations) {
    const bugsSection = document.getElementById('bugsSection');
    const bugsList = document.getElementById('bugsList');
    const expSection = document.getElementById('explanationsSection');
    const expList = document.getElementById('explanationsList');
    const successSection = document.getElementById('successSection');
    
    bugsList.innerHTML = '';
    expList.innerHTML = '';
    bugsSection.style.display = 'none';
    expSection.style.display = 'none';
    successSection.style.display = 'none';
    
    if (bugs.length === 0) { successSection.style.display = 'block'; return; }
    
    bugs.forEach((bug, i) => {
        bugsList.innerHTML += `<div class="bug-item"><div class="bug-title">Bug ${i+1}: ${bug.title}</div><div class="bug-description">${bug.description}</div><div class="bug-code">${bug.code}</div><div class="fix-suggestion"><strong>✅ Fix:</strong> ${bug.fix}</div></div>`;
    });
    bugsSection.style.display = 'block';
    
    explanations.forEach(exp => {
        expList.innerHTML += `<div class="explanation-item"><div class="explanation-title">${exp.title}</div><div class="explanation-text">${exp.text}</div></div>`;
    });
    
    if (explanations.length > 0) expSection.style.display = 'block';
    setTimeout(() => bugsSection.scrollIntoView({behavior: 'smooth'}), 100);
}

function clearCode() {
    document.getElementById('codeInput').value = '';
    document.getElementById('bugsSection').style.display = 'none';
    document.getElementById('explanationsSection').style.display = 'none';
    document.getElementById('successSection').style.display = 'none';
    document.getElementById('codeInput').focus();
}
