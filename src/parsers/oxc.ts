import type { ParserOptions } from "oxc-parser";
import type { Parse } from "./types";

export const key = "oxc-parser";

export const notes = `
- \`experimentalRawTransfer\` options is not supported for WASM yet
- \`oxc-parser\` returns \`errors\` and never throws exceptions, but it is NOT a recoverable parser
  - In some cases, it may return an empty \`Program\`
`.trim();

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
