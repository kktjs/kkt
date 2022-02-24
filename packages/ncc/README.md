@kkt/ncc
===

[![npm version](https://img.shields.io/npm/v/@kkt/ncc.svg)](https://www.npmjs.com/package/@kkt/ncc)

Simple CLI for compiling a Node.js module into a single file, together with all its dependencies, gcc-style. A tool created based on [`kkt`](https://github.com/kktjs/kkt) & [`create-react-app`](https://github.com/facebook/create-react-app), [`@kkt/ncc`](https://www.npmjs.com/package/@kkt/ncc) similar to [@vercel/ncc](https://www.npmjs.com/package/@vercel/ncc)

## Usage

## Quick Start

```bash
$ npx create-kkt my-app -e bundle-node
cd my-app
npm install
```

### Installation

```bash
npm i -g @kkt/ncc
```

### Usage

```bash
$ ncc <cmd> [input-file] [opts]
# input-file default value: src/index.ts
```

### Eg:

```bash
$ ncc build input.js -o dist
```

Outputs the `Node.js` compact build of `input.js` into `dist/input.js`.

## Commands

```bash
Usage: ncc [build|watch] [input-file] [--help|h]

Displays help information.

Options:

  --version, -v         Show version number
  --help, -h            Displays help information.
  -o, --out [dir]       Output directory for build (defaults to dist).
  -m, --minify          Minify output.
  -t, --target          Instructs webpack to target a specific environment (defaults to node14).
  -l, --library         Output a library exposing the exports of your entry point. The parameter "--target=web" works.
  -s, --source-map      Generate source map.
  -e, --external [mod]  Skip bundling 'mod'. Can be used many times.

Example:

  $ ncc build
  $ ncc build --out ./dist
  $ ncc build --minify
  $ ncc watch --minify
  $ ncc build src/app.ts
  $ ncc build --target web --library MyLibrary
  $ ncc build --source-map
```

## Configuration File

Supports `.kktrc.js` and `.kktrc.ts`.

## Example

- [Github Action Contributors](https://github.com/jaywcjlove/github-action-contributors) Github action generates dynamic image URL for contributor list to display it!
- [Generated Badges](https://github.com/jaywcjlove/generated-badges) Create a badge using GitHub Actions (no 3rd parties servers).
- [Coverage Badges](https://github.com/jaywcjlove/coverage-badges-cli) Create coverage badges from coverage reports (no 3rd parties servers).
- [@uiw/react-codemirror](https://github.com/uiwjs/react-codemirror) CodeMirror 6 component for React.
- [uiw](https://github.com/uiwjs/uiw) A high quality UI Toolkit, A Component Library for React.

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/kktjs/kkt/graphs/contributors">
  <img src="https://kktjs.github.io/kkt/CONTRIBUTORS.svg" />
</a>

Made with [github-action-contributors](https://github.com/jaywcjlove/github-action-contributors).

### License

Licensed under the MIT License