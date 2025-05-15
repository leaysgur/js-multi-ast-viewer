import type { ts } from "@ts-morph/bootstrap";
import type { ParseSettings } from "@typescript-eslint/typescript-estree/use-at-your-own-risk";
import type { Parse } from "./types";

export const notes = `
- This is emulating the behavior of \`@typescript-eslint/typescript-estree\`, may not be accurate
- \`errorOnTypeScriptSyntacticAndSemanticIssues\` option only reports whitelisted errors
- \`errors\` is always empty
`.trim();

export const defaultOptions: Partial<ParseSettings> = {
  jsx: true,
  allowInvalidAST: false,
  errorOnUnknownASTType: true,
  errorOnTypeScriptSyntacticAndSemanticIssues: true,
  loc: false,
  range: false,
};

export const parse: Parse = async (code, options) => {
  const parseOptions = JSON.parse(options) as ParseSettings;
  const filename = parseOptions.jsx ? "dummy.tsx" : "dummy.ts";

  const [{ createProject }, { astConverter }] = await Promise.all([
    import("@ts-morph/bootstrap"),
    import("@typescript-eslint/typescript-estree/use-at-your-own-risk"),
  ]);

  // NOTE: Emulate `parseAndGenerateServices` for full compatibility(w/ semantic errors)
  // https://github.com/typescript-eslint/typescript-eslint/blob/af077a040cab200c0c5d973e0c4f2cfce75cfa88/packages/typescript-estree/src/parser.ts#L163
  //
  // To run `@typescript-eslint/typescript-estree` in browser, a lot of Node.js polifills are needed.
  // And also `typescript` with type-checking is required many tweaks!
  const project = await createProject({ useInMemoryFileSystem: true });

  // String > TS-AST
  const sourceFile = project.createSourceFile(filename, code);
  // TS-AST > TS-ESTree
  const result = astConverter(
    sourceFile,
    {
      ...parseOptions,
      comment: true,
      codeFullText: code, // This is required for `comment` option to work
    },
    false,
  ).estree;

  if (parseOptions.errorOnTypeScriptSyntacticAndSemanticIssues) {
    const program = project.createProgram();
    const message = getFirstErrorMessage(program);
    // NOTE: They throw an error in such cases, instead of returning an `errors` array
    if (message) throw new Error(message);
  }

  const comments = result.comments ?? [];
  delete result.comments;
  const program = result;

  return { errors: null, program, comments };
};

// https://github.com/typescript-eslint/typescript-eslint/blob/af077a040cab200c0c5d973e0c4f2cfce75cfa88/packages/typescript-estree/src/semantic-or-syntactic-errors.ts#L21
function getFirstErrorMessage(program: ts.Program): string | undefined {
  const diagnostics = [
    ...program.getSyntacticDiagnostics(),
    ...program.getSemanticDiagnostics(),
  ].filter((diagnostic) => {
    switch (diagnostic.code) {
      case 1013: // "A rest parameter or binding pattern may not have a trailing comma."
      case 1014: // "A rest parameter must be last in a parameter list."
      case 1044: // "'{0}' modifier cannot appear on a module or namespace element."
      case 1045: // "A '{0}' modifier cannot be used with an interface declaration."
      case 1048: // "A rest parameter cannot have an initializer."
      case 1049: // "A 'set' accessor must have exactly one parameter."
      case 1070: // "'{0}' modifier cannot appear on a type member."
      case 1071: // "'{0}' modifier cannot appear on an index signature."
      case 1085: // "Octal literals are not available when targeting ECMAScript 5 and higher. Use the syntax '{0}'."
      case 1090: // "'{0}' modifier cannot appear on a parameter."
      case 1096: // "An index signature must have exactly one parameter."
      case 1097: // "'{0}' list cannot be empty."
      case 1098: // "Type parameter list cannot be empty."
      case 1099: // "Type argument list cannot be empty."
      case 1117: // "An object literal cannot have multiple properties with the same name in strict mode."
      case 1121: // "Octal literals are not allowed in strict mode."
      case 1123: //  "Variable declaration list cannot be empty."
      case 1141: // "String literal expected."
      case 1162: // "An object member cannot be declared optional."
      case 1164: // "Computed property names are not allowed in enums."
      case 1172: // "'extends' clause already seen."
      case 1173: // "'extends' clause must precede 'implements' clause."
      case 1175: // "'implements' clause already seen."
      case 1176: // "Interface declaration cannot have 'implements' clause."
      case 1190: // "The variable declaration of a 'for...of' statement cannot have an initializer."
      case 1196: // "Catch clause variable type annotation must be 'any' or 'unknown' if specified."
      case 1200: // "Line terminator not permitted before arrow."
      case 1206: // "Decorators are not valid here."
      case 1211: // "A class declaration without the 'default' modifier must have a name."
      case 1242: // "'abstract' modifier can only appear on a class, method, or property declaration."
      case 1246: // "An interface property cannot have an initializer."
      case 1255: // "A definite assignment assertion '!' is not permitted in this context."
      case 1308: // "'await' expression is only allowed within an async function."
      case 2364: // "The left-hand side of an assignment expression must be a variable or a property access."
      case 2369: // "A parameter property is only allowed in a constructor implementation."
      case 2452: // "An enum member cannot have a numeric name."
      case 2462: // "A rest element must be last in a destructuring pattern."
      case 8017: // "Octal literal types must use ES2015 syntax. Use the syntax '{0}'."
      case 17012: // "'{0}' is not a valid meta-property for keyword '{1}'. Did you mean '{2}'?"
      case 17013: // "Meta-property '{0}' is only allowed in the body of a function declaration, function expression, or constructor."
        return true;
    }
    return false;
  });

  if (diagnostics.length !== 0) return diagnostics.at(0)!.messageText.toString();
}
