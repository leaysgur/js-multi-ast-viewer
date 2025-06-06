import pkg from "../../package.json";
import type { Options, Comment } from "acorn";
import type { Parse } from "./index";

export const key = `acorn@${pkg["dependencies"]["acorn"]}(+acorn-jsx@${pkg["dependencies"]["acorn-jsx"]})`;

export const notes = [
  "`acorn-jsx` and `@sveltejs/acorn-typescript` with `jsx: true` does not produce the same AST",
];

export const defaultOptions: () => Partial<Options> = () => ({
  sourceType: "module",
  ecmaVersion: "latest",
  jsxPluginOptions: {},
  allowReserved: false,
  allowReturnOutsideFunction: false,
  allowImportExportEverywhere: false,
  checkPrivateFields: true,
  preserveParens: false,
  locations: false,
  ranges: false,
});

export const parse: Parse = async (code, options) => {
  const { jsxPluginOptions, ...parseOptions } = JSON.parse(options) as {
    jsxPluginOptions: Parameters<typeof jsxPlugin>[0];
  } & Options;
  const comments: Comment[] = [];

  const [{ Parser }, { default: jsxPlugin }] = await Promise.all([
    import("acorn"),
    import("acorn-jsx"),
  ]);
  let parser;
  if (jsxPluginOptions) {
    parser = Parser.extend(jsxPlugin(jsxPluginOptions));
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
