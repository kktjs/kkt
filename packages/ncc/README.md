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
  --filename            output file name.

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

Supports `.kktrc.js` and `.kktrc.ts`. Configuration [Example](https://github.com/uiwjs/react-codemirror/blob/880754a18ace17f40571330985d85e7eca770351/.kktrc.ts#L11-L74):

```typescript
import webpack, { Configuration } from 'webpack';
import { LoaderConfOptions } from 'kkt';
import lessModules from '@kkt/less-modules';

export default (conf: Configuration, env: 'development' | 'production', options: LoaderConfOptions) => {
  conf = lessModules(conf, env, options);
  if (options.bundle) {
    conf.output!.library = '@uiw/codemirror';
    conf.output!.filename = `codemirror${options.minify ? '.min.js' : '.js'}`;
    conf.externals = {
      '@codemirror/basic-setup': {
        root: ['CM', '@codemirror/basic-setup'],
        commonjs: '@codemirror/basic-setup',
        commonjs2: '@codemirror/basic-setup',
      },
      oneDark: {
        root: ['CM', '@codemirror/theme-one-dark', 'oneDark'],
      },
      StateEffect: {
        root: ['CM', '@codemirror/state', 'StateEffect'],
      },
      EditorState: {
        root: ['CM', '@codemirror/basic-setup', 'EditorState'],
      },
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
      },
    };
  } else {
    // ......
  }
  return conf;
};

```

## Example

- [Github Action Contributors](https://github.com/jaywcjlove/github-action-contributors) Github action generates dynamic image URL for contributor list to display it!
- [Generated Badges](https://github.com/jaywcjlove/generated-badges) Create a badge using GitHub Actions (no 3rd parties servers).
- [Coverage Badges](https://github.com/jaywcjlove/coverage-badges-cli) Create coverage badges from coverage reports (no 3rd parties servers).
- [@uiw/react-codemirror](https://github.com/uiwjs/react-codemirror) CodeMirror 6 component for React.
- [@uiw/react-split](https://github.com/uiwjs/react-split) A piece of view can be divided into areas where the width or height can be adjusted by dragging.
- [@uiw/react-layout](https://github.com/uiwjs/react-layout) Layout component for React. Handling the overall layout of a page.
- [@uiw/react-amap](https://github.com/uiwjs/react-amap) 基于 React 封装的高德地图组件。
- [@uiw/react-baidu-map](https://github.com/uiwjs/react-baidu-map) 基于 React 封装的百度地图组件。
- [@uiw/react-markdown-preview](https://github.com/uiwjs/react-markdown-preview) React component preview markdown text in web browser. 
- [@uiw/react-textarea-code-editor](https://github.com/uiwjs/react-textarea-code-editor) A simple code editor with syntax highlighting.
- [@uiw/react-heat-map](https://github.com/uiwjs/react-heat-map) A lightweight calendar heatmap react component.
- [uiw](https://github.com/uiwjs/uiw) A high quality UI Toolkit, A Component Library for React.
- [More...](https://github.com/kktjs/kkt/network/dependents?package_id=UGFja2FnZS0zMDE5ODU0NTI4)

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/kktjs/kkt/graphs/contributors">
  <img src="https://kktjs.github.io/kkt/CONTRIBUTORS.svg" />
</a>

Made with [github-action-contributors](https://github.com/jaywcjlove/github-action-contributors).

### License

Licensed under the MIT License
