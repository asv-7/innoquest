// Legacy compatibility: sample programs and video resources
window.__samples__ = {
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
}`, title: "Sample 5 (C): Array Out of Bounds", bugs: [{title: "Array Out of Bounds", description: "Loop goes beyond valid indices.", code: "for (int i = 0; i <= 5; i++)", fix: "Use i < 5 instead of i <= 5"}], explanation: [{title: "🤖 AI: Arrays", text: "Array size N has indices 0 to N-1. Off-by-one errors are classic bugs."}]},
    6: {code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int *ptr;
    *ptr = 10;
    printf("Value: %d\\n", *ptr);
    return 0;
}`, title: "Sample 6 (C): Uninitialized Pointer", bugs: [{title: "Uninitialized Pointer", description: "Pointer not pointing to valid memory.", code: "int *ptr; *ptr=10;", fix: "int *ptr = malloc(sizeof(int));"}], explanation: [{title: "🤖 AI: Pointers", text: "Pointers must point to valid memory. Use malloc() or & before dereferencing."}]},
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
    for (int i = 0; i < 100; i++) { arr[i] = i * 2; }
    return 0;
}`, title: "Sample 8 (C): Memory Leak", bugs: [{title: "Memory Leak", description: "malloc without free wastes memory.", code: "malloc(...) without free", fix: "Add free(arr);"}], explanation: [{title: "🤖 AI: Memory", text: "Every malloc needs free. Not freeing causes memory leaks that crash programs."}]}
};

// videos have been removed from the application per user request.
window.videoResources = {};

window.showVideos = function(language) {
    const grid = document.getElementById('videosGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const videos = window.videoResources[language] || [];
    videos.forEach(video => {
        grid.innerHTML += `<div class="video-card"><div class="video-thumbnail">▶️</div><div class="video-info"><div class="video-title">${video.title}</div><div class="video-description">${video.description}</div><div class="video-duration">⏱️ ${video.duration}</div><a href="${video.url}" target="_blank" class="video-link">Watch on YouTube</a></div></div>`;
    });
};

window.loadSample = function(num) {
    const sample = window.__samples__[num];
    if (!sample) return;
    const el = document.getElementById('codeInput');
    if (el) el.value = sample.code;
    // Try to call analyze via main (if available)
    if (window.onAnalyzeClick) setTimeout(() => window.onAnalyzeClick(), 100);
    else if (window.analyzeCode) setTimeout(() => window.analyzeCode(num), 100);
};
