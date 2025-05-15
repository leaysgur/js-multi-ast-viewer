import * as oxc from "./oxc";
import * as acorn from "./acorn";
import * as tsEstree from "./typescript-estree";

export const parserKeys = [oxc.key, acorn.key, tsEstree.key];

// TODO: Dynamic import here?
export const getParser = (key: string) => {
  if (key === oxc.key) return oxc;
  if (key === acorn.key) return acorn;
  if (key === tsEstree.key) return tsEstree;
  throw new Error(`Unreachable: Parser not found for key: ${key}`);
};
