import type { Options, Comment } from "acorn";
import type { Parse } from "./types";

export const notes = `
- \`acorn-jsx\` plugin is always enabled
- Acorn does not support TypeScript, and we do not add plugin for it
- \`errors\` is always empty
`.trim();

export const defaultOptions: Partial<Options> = {
  sourceType: "module",
  ecmaVersion: "latest",
  allowReserved: false,
  allowReturnOutsideFunction: false,
  allowImportExportEverywhere: false,
  checkPrivateFields: true,
  preserveParens: false,
  locations: false,
  ranges: false,
};

export const parse: Parse = async (code, options) => {
  const parseOptions = JSON.parse(options) as Options;
  const comments: Comment[] = [];

  const [{ Parser }, { default: jsxPlugin }] = await Promise.all([
    import("acorn"),
    import("acorn-jsx"),
  ]);
  const parser = Parser.extend(jsxPlugin());

  const result = parser.parse(code, {
    ...parseOptions,
    onComment: comments,
  });

  const program = result;

  return { errors: [], comments, program };
};
