# 🐛 Code Debugger Web App

A web application that helps you find and understand bugs in your code with simple English explanations.

## Getting Started

### Step 1: Click "Analyze Code"
- The app will scan your code for common bugs
- Results appear in real-time

### Step 2: Review Bugs & Fixes
- See what bugs were found
- Read simple explanations of what went wrong
- Find the suggested fixes

### Step 3: Learn from Samples
- Try the 4 pre-loaded sample programs
- Click "Load & Debug" to load a buggy program
- Study the bugs and their explanations

## Features

> The web page places the code input (Step 1) immediately under the main heading; language selection and sample programs follow, with analysis results appearing below the samples. This ensures Step 1 is front‑and‑center.

✅ **Code Analysis** - Paste any code and automatically detect common bugs
✅ **Simple Explanations** - Understand what's wrong in beginner-friendly language  
✅ **8 Sample Programs** - Learn from 4 JavaScript and 4 C language buggy programs
✅ **Debugging Tips** - Get helpful hints on how to avoid common mistakes
✅ **Multiple Languages** - Optimized for JavaScript, C, and Java (choose one language at a time using the radio buttons)
✅ **Clean Interface** - Easy-to-use design that works on all devices

## Common Bugs Detected

### JavaScript Bugs:
1. **Missing Semicolons** - Identifies incomplete statements
2. **Variable Scope Issues** - Detects variables declared in wrong scope with let/const
3. **Loose Equality (==)** - Warns about type coercion problems
4. **Missing Return Statements** - Finds functions that don't return values
5. **Array Index Errors** - Checks for potential out-of-bounds access
6. **Infinite Loops** - Detects while(true) loops
7. **Max/Min Initialization** - Spots incorrect initialization of max/min variables
8. **Variable Typos** - Identifies potentially misspelled variables

### C Language Bugs:
1. **Missing Semicolons** - Every statement must end with ;
2. **Array Out of Bounds** - Off-by-one errors in loops (i < n vs i <= n)
3. **Uninitialized Pointers** - Using pointers without pointing to valid memory
4. **Memory Leaks** - Missing free() calls after malloc()
5. **Format Specifier Errors** - Wrong printf/scanf format strings
6. **Missing Includes** - Required headers not included (#include)
7. **Uninitialized Variables** - Using variables before assigning values

## How to Use

### Option 1: Open in Browser
1. Double-click `index.html` to open in your default browser
2. Or right-click → "Open with" → Choose your browser

> **Tip:** Before analyzing, pick a language from the radio buttons (only one may be selected).
### Option 2: Run Full Application with Backend
Instead of the simple static server, you can run the integrated server backend (implemented with Flask) which also handles code compilation/execution.

```bash
# install dependencies
pip install flask  # the underlying framework (imported as `server` in code)

# start the server
python server.py
```

Then visit: `http://localhost:5000` in your browser.

The backend provides a `/run` endpoint that compiles/runs submitted code using local toolchains (node, gcc, javac). It writes the code to a temporary file with the proper extension (`.js`, `.c`, or `.java`) before invoking the corresponding compiler/interpreter. Any compiler or runtime errors are returned and shown in the **Execution Results** panel along with a brief explanation derived from the error text.

> ⚠️ The service executes arbitrary code on your computer. Only run it in a secure, trusted environment and be aware of the security implications.

### Option 3: Use with Live Server Extension (VS Code)
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html` → "Open with Live Server"


## Free Assistant Mode and Login

A lightweight built‑in chat interface is available without any API key. To use it:

1. Enter a username and password (any non-empty values work) in the **Login for Free Assistant** box at the top of the page.
2. After logging in, the chat panel appears. Type questions or paste code snippets and press **Send**.
3. The "free model" runs entirely in your browser, using simple heuristics and the same bug detectors used elsewhere. It is not connected to any paid service.

This lets you experiment with an assistant-style helper even if you don't have an OpenAI key.

---

## Note on AI Integration

- OpenAI/GPT integration has been removed in this version. Analysis is performed locally in your browser using built-in detectors for JavaScript, C, and Java.

## Sample Programs

### JavaScript Samples:

#### Sample 1: Missing Semicolon (Beginner)
```javascript
function sumNumbers(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum = sum + i;
    }
    return sum  // ❌ Missing semicolon
}
```
**Bug:** Missing semicolon at end of return  
**Fix:** Add `;` after `return sum`

### Sample 2: Variable Scope Error (Intermediate)
```javascript
function checkAge(age) {
    if (age >= 18) {
        let status = "Adult";  // ❌ Declared inside if block
    }
    return status;  // Can't access here!
}
```
**Bug:** `status` is declared with `let` inside if block  
**Fix:** Declare `status` outside the if block

### Sample 3: Logic Error with Negative Numbers (Intermediate)
```javascript
function findMax(arr) {
    let max = 0;  // ❌ Wrong! Fails with negatives
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}
// Results: findMax([-5, -2, -10]) returns 0, should return -2
```
**Bug:** Initializing max to 0 doesn't work with negative numbers  
**Fix:** Use `let max = arr[0];` or `let max = -Infinity;`

### Sample 4: Type Coercion Bug (Advanced)
```javascript
function compare(a, b) {
    if (a == b) {  // ❌ Using loose equality
        return "Equal";
    }
    return "Not Equal";
}
compare(5, "5");  // Returns "Equal" - 5 == "5" is true!
```
**Bug:** The `==` operator compares values only, ignoring types  
**Fix:** Use `===` for strict comparison: `if (a === b)`

### C Language Samples:

#### Sample 5: Array Out of Bounds (C - Intermediate)
```c
#include <stdio.h>
int main() {
    int arr[5] = {10, 20, 30, 40, 50};
    for (int i = 0; i <= 5; i++) {  // ❌ Should be i < 5
        printf("%d ", arr[i]);
    }
    return 0;
}
```
**Bug:** Array has 5 elements (indices 0-4), but loop goes to 5, accessing invalid memory  
**Fix:** Use `i < 5` instead of `i <= 5` (off-by-one error)

### Sample 6: Uninitialized Pointer (C - Advanced)
```c
#include <stdio.h>
int main() {
    int *ptr;           // ❌ Pointer not initialized!
    *ptr = 10;          // Crash! ptr points to random memory
    printf("%d", *ptr);
    return 0;
}
```
**Bug:** `ptr` is not initialized to point to valid memory  
**Fix:** Use `int *ptr = malloc(sizeof(int));` or `int x; int *ptr = &x;`

### Sample 7: Missing Semicolon (C - Beginner)
```c
#include <stdio.h>
int main() {
    int sum = 0     // ❌ Missing semicolon!
    for (int i = 1; i <= 5; i++) {
        sum = sum + i;
    }
    return 0;
}
```
**Bug:** Variable declaration missing semicolon  
**Fix:** Add `;` after `int sum = 0;`

### Sample 8: Memory Leak (C - Advanced)
```c

## Development & Build Instructions

This repository includes both frontend code and standalone utilities.

### Building and Testing the Debugger

The `cdebugger.c` program is a minimal ptrace-based debugger. Build it with a POSIX compiler:

```sh
# from workspace root
# Linux/macOS/WSL
gcc cdebugger.c -o cdebugger
# or clang

# Windows (MinGW):
gcc.exe cdebugger.c -o cdebugger.exe
```

Run it by pointing at an executable and stepping with Enter:

```sh
./cdebugger ./some_program arg1 arg2
```

### Analyzer Modules and Tests

Each language analyzer exports a `detect*Bugs(code)` function in `analyzers/`.
A simple test harness shows how they behave; run it with Node:

```sh
npm init -y             # if you don't already have package.json
# ensure modules support
node analyzers/test.js
```

The samples cover missing semicolons, bad loops, null/None checks, and other common mistakes, and the detectors have been enhanced to work accurately on basic code, as demanded by the user.

---

```c
#include <stdlib.h>
int main() {
    int *arr = malloc(100 * sizeof(int));
    
    for (int i = 0; i < 100; i++) {
        arr[i] = i * 2;
    }
    // ❌ Missing free(arr) - memory leak!
    return 0;
}
```
**Bug:** Memory allocated with `malloc()` is never freed  
**Fix:** Add `free(arr);` before returning from the function

## Debugging Tips

### 💡 Tip 1: Read Error Messages
Error messages tell you exactly what's wrong and where to find it.

### 💡 Tip 2: Check Variable Names  
Typos in variable names are super common. Make sure:
- Spelling is correct: `name` ≠ `Name` ≠ `name1`
- Case is consistent: Variables are case-sensitive!

### 💡 Tip 3: Test with Different Examples
Run your code with multiple inputs to find edge cases:
- Empty arrays: `[]`
- Single element: `[1]`
- Negative numbers: `[-5, -2]`
- Large numbers: `[1000000]`

### 💡 Tip 4: Watch Your Loops
Off-by-one errors are VERY common:
- `i < n` excludes the last element
- `i <= n` includes it
- Test: `for (let i = 0; i < 3; i++)` runs 0, 1, 2 (not 3!)

### 💡 Tip 5: Understand Data Types
```javascript
5 == "5"   // true (loose equality - bad!)
5 === "5"  // false (strict equality - good!)
```
Always use `===` to compare values AND types.

### 💡 Tip 6: Return Values Matter
```javascript
// ❌ Returns undefined
let result = myFunction();

// ✅ Returns the value
function myFunction() {
    return 42;
}
```

---

## C Language Debugging Tips

### 💡 Memory Management is Critical
```c
// ❌ CRASH! Uninitialized pointer
int *ptr;
*ptr = 10;

// ✅ CORRECT! malloc allocates memory
int *ptr = malloc(sizeof(int));
*ptr = 10;
free(ptr);  // Always free when done!
```

### 💡 Off-by-One Errors in Loops
```c
// ❌ BUG! Accesses arr[5] which doesn't exist (only 0-4)
int arr[5] = {1,2,3,4,5};
for (int i = 0; i <= 5; i++) {
    printf("%d ", arr[i]);  // ERROR on i=5
}

// ✅ CORRECT! Loop ends at i=4
for (int i = 0; i < 5; i++) {
    printf("%d ", arr[i]);  // OK!
}
```

### 💡 Remember ALL Semicolons
In C, EVERY statement needs a semicolon:
```c
int x = 10;   // ✅ Semicolon required
x = x + 5;    // ✅ Semicolon required
printf("x");  // ✅ Semicolon required
```

### 💡 Pointer vs Address
```c
int x = 10;
int *ptr = &x;      // & = address of x
printf("%d", *ptr); // * = value at address
```

### 💡 Always Pair malloc() with free()
```c
int *arr = malloc(sizeof(int) * 100);
// ... use the array ...
free(arr);  // MUST free at the end!
```

## File Structure

```
INNOQUEST/
├── index.html        # Main webpage
├── style.css         # All styling and layout
├── script.js         # Bug detection and analysis logic
└── README.md         # This file
```

## Browser Compatibility

✅ Chrome/Chromium  
✅ Firefox  
✅ Safari  
✅ Edge  
✅ Opera  

Works on:
- Desktop computers
- Tablets
- Mobile phones

## Tips for Best Results

1. **Be Specific** - The more code you provide, the better the analysis
2. **Format Nicely** - Indented code is easier to understand
3. **Include Context** - If possible, include function definitions and variable declarations
4. **Test Solutions** - After fixing a bug, test your code with multiple inputs

## Common Questions

**Q: Does it analyze all programming languages?**  
A: It's optimized for JavaScript and C, but can detect patterns in other languages like Python, Java, and C++ too.

**Q: Will it find all bugs?**  
A: It finds common patterns and mistakes. Use it as a learning tool to understand debugging concepts!

**Q: What C-specific bugs can it detect?**  
A: Memory leaks, pointer errors, array out of bounds, missing semicolons, uninitialized variables, and more.

**Q: Can I save my analysis?**  
A: You can copy the text from the analysis. For permanent storage, take a screenshot or use browser's print-to-PDF feature.

**Q: Is my code private?**  
A: Yes! All analysis happens in your browser. Nothing is sent to any server.

## Learning Resources

### JavaScript:
- https://www.w3schools.com/js/ - JavaScript basics
- https://developer.mozilla.org/en-US/docs/Web/JavaScript - MDN Docs
- https://www.codecademy.com/ - Interactive coding lessons

### C Language:
- https://www.tutorialspoint.com/c/ - C tutorials
- https://www.w3schools.com/c/ - C language guide
- https://www.learn-c.org/ - Interactive C lessons
- https://en.cppreference.com/w/c - C reference documentation

## Version

**Code Debugger v1.0**  
Last Updated: February 2026

## License

Free to use and share for educational purposes!

---

**Happy Debugging! 🚀**
