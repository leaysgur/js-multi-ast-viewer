import * as oxc from "./oxc";
import * as acornJsx from "./acorn-jsx";
import * as acornTs from "./acorn-ts";
import * as meriyah from "./meriyah";
import * as tsEstree from "./typescript-estree";

// Each parser has its own set of types!
type ParseResult = {
  comments: any[];
  errors: any[] | null;
  program: any;
};
export type Parse = (code: string, optionsString: string) => Promise<ParseResult>;

export const parserKeys = [oxc.key, acornJsx.key, meriyah.key, tsEstree.key, acornTs.key] as const;

export const getParserImpl = (key: string) => {
  if (key === oxc.key) return oxc;
  if (key === acornJsx.key) return acornJsx;
  if (key === meriyah.key) return meriyah;
  if (key === tsEstree.key) return tsEstree;
  if (key === acornTs.key) return acornTs;
  throw new Error(`Unreachable: Parser not found for key: ${key}`);
};
