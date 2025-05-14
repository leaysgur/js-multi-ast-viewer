// Each parser has its own set of types!
type ParseResult = {
  comments: any[];
  errors: any[];
  program: any;
};
export type Parse = (code: string, optionsString: string) => Promise<ParseResult>;
