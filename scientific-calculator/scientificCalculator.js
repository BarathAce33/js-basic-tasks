const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/* ---------- Helper Functions ---------- */

function isOperator(op) {
  return ["+", "-", "*", "/", "^"].includes(op);
}

function precedence(op) {
  if (op === "+" || op === "-") return 1;
  if (op === "*" || op === "/") return 2;
  if (op === "^") return 3;
  return 0;
}

function applyOperator(a, b, op) {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return a / b;
    case "^": return Math.pow(a, b);
  }
}

/* ---------- Supported Functions ---------- */
function applyFunction(fn, value) {
  switch (fn) {
    case "sin": return Math.sin(value * Math.PI / 180);
    case "cos": return Math.cos(value * Math.PI / 180);
    case "tan": return Math.tan(value * Math.PI / 180);
    case "log": return Math.log10(value);
    case "ln": return Math.log(value);
    case "sqrt": return Math.sqrt(value);
  }
}

/* ---------- Core Evaluation Logic ---------- */
function evaluateExpression(expr) {
  let values = [];
  let ops = [];

  for (let i = 0; i < expr.length; i++) {
    if (expr[i] === " ") continue;

    // Number parsing
    if (!isNaN(expr[i]) || expr[i] === ".") {
      let num = "";
      while (i < expr.length && (!isNaN(expr[i]) || expr[i] === ".")) {
        num += expr[i++];
      }
      values.push(parseFloat(num));
      i--;
    }

    // Function parsing (sin, cos, etc.)
    else if (/[a-z]/i.test(expr[i])) {
      let fn = "";
      while (/[a-z]/i.test(expr[i])) fn += expr[i++];
      ops.push(fn);
      i--;
    }

    // Opening bracket
    else if (expr[i] === "(") {
      ops.push(expr[i]);
    }

    // Closing bracket
    else if (expr[i] === ")") {
      while (ops.length && ops[ops.length - 1] !== "(") {
        let op = ops.pop();

        if (!isOperator(op)) {
          values.push(applyFunction(op, values.pop()));
        } else {
          let b = values.pop();
          let a = values.pop();
          values.push(applyOperator(a, b, op));
        }
      }
      ops.pop(); // remove "("

      // Apply function if exists
      if (ops.length && !isOperator(ops[ops.length - 1]) && ops[ops.length - 1] !== "(") {
        values.push(applyFunction(ops.pop(), values.pop()));
      }
    }

    // Operator
    else if (isOperator(expr[i])) {
      while (
        ops.length &&
        precedence(ops[ops.length - 1]) >= precedence(expr[i])
      ) {
        let b = values.pop();
        let a = values.pop();
        values.push(applyOperator(a, b, ops.pop()));
      }
      ops.push(expr[i]);
    }
  }

  // Remaining operations
  while (ops.length) {
    let op = ops.pop();
    if (!isOperator(op)) {
      values.push(applyFunction(op, values.pop()));
    } else {
      let b = values.pop();
      let a = values.pop();
      values.push(applyOperator(a, b, op));
    }
  }

  return values[0];
}

/* ---------- Input ---------- */

console.log("Scientific Calculator Started...");
rl.question("Enter expression: ", (expression) => {
  const result = evaluateExpression(expression);
  console.log("Result:", result);
  rl.close();
});
