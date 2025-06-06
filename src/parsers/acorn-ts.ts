import pkg from "../../package.json";
import type { Options, Comment } from "acorn";
import type { Parse } from "./index";

export const key = `acorn@${pkg["dependencies"]["acorn"]}(+acorn-typescript@${pkg["dependencies"]["@sveltejs/acorn-typescript"]})`;

export const notes = [
  "`@sveltejs/acorn-typescript` plugin supports TSX",
  "`locations` option cannot be disabled with `@sveltejs/acorn-typescript`",
  "`@sveltejs/acorn-typescript` does not respect `preserveParens` for `TSParenthesizedType`",
  "`@sveltejs/acorn-typescript` produces TS-ESTree like AST, but not exactly the same as `@typescript-eslint/typescript-estree`",
  "`acorn-jsx` and `@sveltejs/acorn-typescript` with `jsx: true` does not produce the same AST",
];

export const defaultOptions: () => Partial<Options> = () => ({
  sourceType: "module",
  ecmaVersion: "latest",
  tsPluginOptions: { jsx: true },
  allowReserved: false,
  allowReturnOutsideFunction: false,
  allowImportExportEverywhere: false,
  checkPrivateFields: true,
  preserveParens: false,
  locations: false,
  ranges: false,
});

export const parse: Parse = async (code, options) => {
  const { tsPluginOptions, ...parseOptions } = JSON.parse(options) as {
    tsPluginOptions: Parameters<typeof tsPlugin>[0];
  } & Options;
  const comments: Comment[] = [];

  const [{ Parser }, { tsPlugin }] = await Promise.all([
    import("acorn"),
    import("@sveltejs/acorn-typescript"),
  ]);
  let parser;
  if (tsPluginOptions) {
    parser = Parser.extend(tsPlugin(tsPluginOptions));
    parseOptions.locations = true; // This is required for `@sveltejs/acorn-typescript`
  } else {
    parser = Parser;
  }

  const result = parser.parse(code, {
    ...parseOptions,
    onComment: comments,
  });

  const program = result;

  return { errors: null, comments, program };
};
