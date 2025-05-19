import pkg from "../../package.json";
import type { Options } from "meriyah";
import type { Parse } from "./index";

export const key = `meriyah@${pkg["dependencies"]["meriyah"]}`;

export const notes = ["Meriyah does not support TypeScript"];

export const defaultOptions: () => Partial<Options> = () => ({
  module: true,
  impliedStrict: true,
  next: true,
  jsx: true,
  raw: true,
  preserveParens: true,
  globalReturn: false,
  ranges: false,
  loc: false,
});

export const parse: Parse = async (code, options) => {
  const parseOptions = JSON.parse(options) as Options;
  const comments: Comment[] = [];

  const { parse } = await import("meriyah");
  const result = parse(code, { ...parseOptions, onComment: comments });

  const program = result;

  return { errors: null, comments, program };
};
