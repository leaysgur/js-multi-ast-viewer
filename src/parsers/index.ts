import * as oxc from "./oxc";
import * as acorn from "./acorn";
import * as meriyah from "./meriyah";
import * as tsEstree from "./typescript-estree";

// Each parser has its own set of types!
type ParseResult = {
  comments: any[];
  errors: any[] | null;
  program: any;
};
export type Parse = (code: string, optionsString: string) => Promise<ParseResult>;

export const parserKeys = [oxc.key, acorn.key, meriyah.key, tsEstree.key] as const;

export const getParserImpl = (key: string) => {
  if (key === oxc.key) return oxc;
  if (key === acorn.key) return acorn;
  if (key === meriyah.key) return meriyah;
  if (key === tsEstree.key) return tsEstree;
  throw new Error(`Unreachable: Parser not found for key: ${key}`);
};
