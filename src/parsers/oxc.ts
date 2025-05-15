import pkg from "../../package.json";
import type { ParserOptions } from "oxc-parser";
import type { Parse } from "./index";

export const key = `oxc-parser@${pkg["dependencies"]["oxc-parser"]}`;

export const notes = [
  "`experimentalRawTransfer` option is not supported for WASM yet",
  "`oxc-parser` returns `errors` and never throws exceptions, but it may return an empty `Program` in some cases",
];

export const defaultOptions: () => Partial<ParserOptions> = () => ({
  sourceType: "module",
  lang: "tsx",
  astType: "ts",
  preserveParens: true,
  showSemanticErrors: true,
});

export const parse: Parse = async (code, options) => {
  const parseOptions = JSON.parse(options) as ParserOptions;
  const filename = parseOptions.lang ? `dummy.${parseOptions.lang}` : "dummy.tsx";

  const { parseSync } = await import("oxc-parser");
  const { errors, comments, program } = parseSync(filename, code, parseOptions);

  return { errors, comments, program };
};
