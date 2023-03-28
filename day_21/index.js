function parseExpression(str) {
  if (!isNaN(str)) return { type: "number", value: parseInt(str) }
  const [left, op, right] = str.split(" ");
  return {
    type: op,
    left: { type: "var", name: left },
    right: { type: "var", name: right }
  };
}

const processInput = input => Object.fromEntries(
  input.trim().replace(/\r\n/g, "\n").split("\n")
    .map(line => line.split(": "))
    .map(([name, expression]) => [name, parseExpression(expression)])
);

function evaluate(expr, env) {
  switch (expr.type) {
    case "number": return expr.value;
    case "var": return evaluate(env[expr.name], env);
    case "+": return evaluate(expr.left, env) + evaluate(expr.right, env);
    case "-": return evaluate(expr.left, env) - evaluate(expr.right, env);
    case "*": return evaluate(expr.left, env) * evaluate(expr.right, env);
    case "/": return evaluate(expr.left, env) / evaluate(expr.right, env);
    default: throw new Error(`Cannot evaluate expression of type ${expr.type}`);
  }
}

const part1 = parsedExpr => evaluate(parsedExpr.root, parsedExpr);

function containsUnknown(expr, env) {
  if (expr.type === "??") return true;
  if (expr.type === "number") return false;
  if (expr.type === "var") return containsUnknown(env[expr.name], env);
  return (containsUnknown(expr.left, env) || containsUnknown(expr.right, env));
}

function solveEquation(expression, equalsValue, env) {
  if (expression.type === "??")
    return equalsValue;
  if (expression.type === "var")
    return solveEquation(env[expression.name], equalsValue, env);

  const leftIsUnknown = containsUnknown(expression.left, env);
  const [unknownSide, knownSide] = leftIsUnknown
    ? [expression.left, expression.right]
    : [expression.right, expression.left];
  const knownSideValue = evaluate(knownSide, env);

  switch (expression.type) {
    case "+":
      return solveEquation(unknownSide, equalsValue - knownSideValue, env);
    case "*":
      return solveEquation(unknownSide, equalsValue / knownSideValue, env);
    case "-":
      return leftIsUnknown
        ? solveEquation(unknownSide, equalsValue + knownSideValue, env)
        : solveEquation(unknownSide, knownSideValue - equalsValue, env);
    case "/":
      return leftIsUnknown
        ? solveEquation(unknownSide, equalsValue * knownSideValue, env)
        : solveEquation(unknownSide, knownSideValue / equalsValue, env);
    default:
      throw new Error(`Unsupported expression type '${unknownSide.type}'`);
  }
}

function part2(parsedExpr) {
  parsedExpr.humn = { type: "??" };
  const root = parsedExpr.root;

  const [unknownSide, knownSide] = containsUnknown(root.left, parsedExpr)
    ? [root.left, root.right]
    : [root.right, root.left];
  const knownSideValue = evaluate(knownSide, parsedExpr);

  return solveEquation(unknownSide, knownSideValue, parsedExpr);
};

module.exports = { processInput, part1, part2 };
