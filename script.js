// ===============================
// BASIC STATE
// ===============================
let expression = "";
let ans = 0;
let mode = "DEG";

const resultBox = document.getElementById("result");
const exprBox = document.getElementById("expression");
const historyBox = document.getElementById("history");

// ===============================
// DISPLAY UPDATE
// ===============================
function updateDisplay() {
    exprBox.textContent = expression;
}

// ===============================
// INPUT FUNCTIONS
// ===============================
function inputNum(num) {
    expression += num;
    updateDisplay();
}

function inputOp(op) {
    expression += op;
    updateDisplay();
}

function inputFn(fn) {
    expression += fn;
    updateDisplay();
}

function inputConst(val) {
    if (val === "ans") {
        expression += ans;
    } else {
        expression += val;
    }
    updateDisplay();
}

function inputDot() {
    expression += ".";
    updateDisplay();
}

// ===============================
// CLEAR / BACKSPACE
// ===============================
function clearAll() {
    expression = "";
    resultBox.textContent = "0";
    updateDisplay();
}

function clearEntry() {
    expression = expression.slice(0,-1);
    updateDisplay();
}

function backspace() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

function toggleSign() {
    expression = "(-1)*(" + expression + ")";
    updateDisplay();
}

// ===============================
// MODE (DEG / RAD)
// ===============================
function setMode(m) {
    mode = m;

    document.getElementById("degBtn").classList.toggle("active", m === "DEG");
    document.getElementById("radBtn").classList.toggle("active", m === "RAD");
}

// ===============================
// FACTORIAL
// ===============================
function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0) return 1;
    let res = 1;
    for (let i = 1; i <= n; i++) res *= i;
    return res;
}

// ===============================
// MAIN CALCULATION
// ===============================
function calculate() {
    try {
        let exp = expression;

        // POWER FIX (^ → **)
        exp = exp.replace(/\^/g, "**");

        // FUNCTIONS MAP
        exp = exp
            .replace(/sin\(/g, mode === "DEG" ? "Math.sin(Math.PI/180*" : "Math.sin(")
            .replace(/cos\(/g, mode === "DEG" ? "Math.cos(Math.PI/180*" : "Math.cos(")
            .replace(/tan\(/g, mode === "DEG" ? "Math.tan(Math.PI/180*" : "Math.tan(")
            .replace(/log\(/g, "Math.log10(")
            .replace(/ln\(/g, "Math.log(")
            .replace(/sqrt\(/g, "Math.sqrt(")
            .replace(/cbrt\(/g, "Math.cbrt(")
            .replace(/abs\(/g, "Math.abs(");

        // CONSTANTS
        exp = exp.replace(/Math.PI/g, "Math.PI")
                 .replace(/Math.E/g, "Math.E");

        // FACTORIAL (n!)
        exp = exp.replace(/(\d+)!/g, "factorial($1)");

        // PERCENT
        exp = exp.replace(/(\d+)%/g, "($1/100)");

        let result = eval(exp);

        if (!isFinite(result)) throw "Error";

        resultBox.textContent = result;
        resultBox.classList.remove("error");

        // SAVE ANS
        ans = result;

        // HISTORY
        addToHistory(expression + " = " + result);

        // UPDATE EXPRESSION
        expression = result.toString();
        updateDisplay();

    } catch (e) {
        resultBox.textContent = "Error";
        resultBox.classList.add("error");
    }
}

// ===============================
// HISTORY
// ===============================
function addToHistory(item) {
    let div = document.createElement("div");
    div.className = "history-item";
    div.textContent = item;

    div.onclick = () => {
        expression = item.split("=")[0].trim();
        updateDisplay();
    };

    historyBox.prepend(div);
}

// ===============================
// KEYBOARD SUPPORT (YOUR CODE)
// ===============================
document.addEventListener('keydown', function(e) {
    const k = e.key;

    if (!isNaN(k) && k !== ' ') { inputNum(k); }
    else if (k === '+') { inputOp('+'); }
    else if (k === '-') { inputOp('-'); }
    else if (k === '*') { inputOp('*'); }
    else if (k === '/') { e.preventDefault(); inputOp('/'); }
    else if (k === '(') { inputOp('('); }
    else if (k === ')') { inputOp(')'); }
    else if (k === '.') { inputDot(); }
    else if (k === '%') { inputOp('%'); }
    else if (k === '^') { inputOp('^'); }
    else if (k === 'Enter' || e.code ==='NumpadEnter') { 
        calculate(); 
    }
    else if (k === 'Escape') { clearAll(); }
    else if (k === 'Backspace') { backspace(); }
});