# js-multi-ast-viewer

A viewer that allows you to compare JS/TS ASTs output by multiple parsers side-by-side!

![example](./top.png)

Currently supports:

- `oxc-parser`: JS, JSX, TS, TSX
- `acorn` + `acorn-jsx`: JS, JSX
- `meriyah`: JS, JSX
- `@typescript-eslint/typescript-estree`: JS, JSX, TS, TSX
  - Supports type-check `errorOnTypeScriptSyntacticAndSemanticIssues` option 💪
- `acorn` + `@sveltejs/acorn-typescript`: JS, JSX, TS, TSX

## Development

```sh
pnpm i
pnpm dev
```
