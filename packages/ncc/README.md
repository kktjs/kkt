@kkt/ncc
===

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
Usage: ncc [build] [input-file] [--help|h]

Displays help information.

Options:

  --version, -v         Show version number
  --help, -h            Displays help information.
  -o, --out [dir]       Output directory for build (defaults to dist).
  -m, --minify          Minify output.
  -s, --source-map      Generate source map.
  -e, --external [mod]  Skip bundling 'mod'. Can be used many times.

Example:

  $ ncc build
  $ ncc build --out ./dist
  $ ncc build --minify
  $ ncc build src/app.ts
  $ ncc build --source-map
```

## Configuration File

Supports `.kktrc.js` and `.kktrc.ts`.

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/kktjs/kkt/graphs/contributors">
  <img src="https://kktjs.github.io/kkt/CONTRIBUTORS.svg" />
</a>

Made with [github-action-contributors](https://github.com/jaywcjlove/github-action-contributors).


### License

Licensed under the MIT License