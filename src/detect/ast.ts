import ts from "typescript";

export function parseSource(fileName: string, source: string): ts.SourceFile {
  return ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
}

export function stringLiteral(node: ts.Expression | undefined): string | undefined {
  if (!node) return undefined;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  return undefined;
}

export function primitiveLiteral(node: ts.Expression | undefined): string | number | boolean | undefined {
  if (!node) return undefined;
  const text = stringLiteral(node);
  if (text !== undefined) return text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  return undefined;
}

export function objectProps(node: ts.Expression | undefined): Map<string, ts.Expression> {
  const props = new Map<string, ts.Expression>();
  if (!node || !ts.isObjectLiteralExpression(node)) return props;
  for (const prop of node.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    const name = ts.isIdentifier(prop.name)
      ? prop.name.text
      : ts.isStringLiteral(prop.name)
        ? prop.name.text
        : undefined;
    if (name) props.set(name, prop.initializer);
  }
  return props;
}

export function walkCalls(sourceFile: ts.SourceFile, visit: (call: ts.CallExpression, method: string) => void): void {
  const calls: Array<{ call: ts.CallExpression; method: string }> = [];
  const walk = (node: ts.Node): void => {
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
      calls.push({ call: node, method: node.expression.name.text });
    }
    ts.forEachChild(node, walk);
  };
  walk(sourceFile);
  calls.sort((a, b) => methodStart(a.call, sourceFile) - methodStart(b.call, sourceFile));
  for (const item of calls) visit(item.call, item.method);
}

function methodStart(call: ts.CallExpression, sourceFile: ts.SourceFile): number {
  if (ts.isPropertyAccessExpression(call.expression)) {
    return call.expression.name.getStart(sourceFile);
  }
  return call.getStart(sourceFile);
}
