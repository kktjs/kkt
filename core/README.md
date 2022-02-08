<p align="center">
  <a href="https://github.com/kktjs/kkt">
    <img src="https://raw.githubusercontent.com/kktjs/kkt/d2bb00dc2d0bd9bb133f3a369d0ad2f5330ed4af/website/kkt.svg?sanitize=true" alt="KKT LOGO">
  </a>
</p>

<p align="center">
  <a href="https://github.com/kktjs/kkt/actions">
    <img src="https://github.com/kktjs/kkt/workflows/Build%20KKT%20&%20Example/badge.svg" alt="Build KKT & Example">
  </a>
  <a href="https://github.com/kktjs/kkt/issues">
    <img src="https://img.shields.io/github/issues/kktjs/kkt.svg" alt="Github issues">
  </a>
  <a href="https://github.com/kktjs/kkt/network">
    <img src="https://img.shields.io/github/forks/kktjs/kkt.svg" alt="Github Forks">
  </a>
  <a href="https://github.com/kktjs/kkt/stargazers">
    <img src="https://img.shields.io/github/stars/kktjs/kkt.svg" alt="Github Stars">
  </a>
  <a href="https://github.com/kktjs/kkt/releases">
    <img src="https://img.shields.io/github/release/kktjs/kkt.svg" alt="Github Releases">
  </a>
  <a href="https://www.npmjs.com/package/kkt">
    <img src="https://img.shields.io/npm/v/kkt.svg" alt="npm version">
  </a>
</p>

Create React apps with no build configuration, Cli tool for creating react apps. Another tool, [`kkt-ssr`](https://github.com/kktjs/kkt-ssr), Is a lightweight framework for static and server-rendered applications.

> - [Migrate from kkt 6.x to 7.x](https://github.com/kktjs/kkt/releases/tag/v7.0.0).  
> - [Migrate from kkt 5.x to 6.x](https://github.com/kktjs/kkt/issues/133).  
> - [Migrate from kkt 4.x to 5.x](https://github.com/kktjs/kkt-next/issues/1).  

As of `KKT 6.x` this repo is "lightly" maintained mostly by the community at this point.

### Features:

- ⏱ The code was rewritten using TypeScript.
- ♻️ Recompile the code when project files get added, removed or modified.
- 📚 Readable source code that encourages learning and contribution
- ⚛️ Override [**create-react-app**](https://github.com/facebook/create-react-app) webpack configs without ejecting
- 💝 Expose the configuration file entry and support webpack configuration.
- 🚀 Supports [**creat-kkt**](https://github.com/kktjs/create-kkt) to create different instances.
- ⛑ Jest test runner setup with defaults `kkt test`

## Usage

You will need [`Node.js`](https://nodejs.org) installed on your system. 

```bash
npm install kkt
```

## Open in CodeSandbox

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?logo=codesandbox)](https://codesandbox.io/s/github/kktjs/kkt-codesandbox-tamplate)

## Example

Initialize the project from one of the examples, Let's quickly create a react application:

```bash
$ npx create-kkt my-app -e uiw
# or npm
$ npm create kkt my-app -e `<Example Name>`
# or yarn 
$ yarn create kkt my-app -e `<Example Name>`
```

You can download the following examples directly. [Download page](https://kktjs.github.io/zip/).

- [**`basic`**](https://github.com/kktjs/kkt/tree/master/example/basic) - The [react](https://github.com/facebook/react) base application. [`Open in CodeSandbox`](https://codesandbox.io/s/github/kktjs/kkt/tree/master/example/basic)
- [**`bundle`**](https://github.com/kktjs/kkt/tree/master/example/bundle) - Package the UMD package for developing the React component library.
- [**`electron`**](https://github.com/kktjs/kkt/tree/master/example/electron) - Use an example of [`Electronjs`](https://github.com/electron).
- [**`less`**](https://github.com/kktjs/kkt/tree/master/example/less) - Use an example of `Less`. [`Open in CodeSandbox`](https://codesandbox.io/s/github/kktjs/kkt/tree/master/example/less)
- [**`markdown`**](https://github.com/kktjs/kkt/tree/master/example/markdown) - Use an example of `Markdown`. [`Open in CodeSandbox`](https://codesandbox.io/s/github/kktjs/kkt/tree/master/example/markdown)
- [**`react-component-tsx`**](https://github.com/kktjs/kkt/tree/master/example/react-component-tsx) - Create a project containing the website for the react component library.
- [**`rematch-tsx`**](https://github.com/kktjs/kkt/tree/master/example/rematch-tsx) - Use [`Rematch`](https://github.com/rematch/rematch) example for TypeScript. [`Open in CodeSandbox`](https://codesandbox.io/s/github/kktjs/kkt/tree/master/example/rematch-tsx)
- [**`react-router`**](https://github.com/kktjs/kkt/tree/master/example/react-router) - Use [`react-router`](https://github.com/remix-run/react-router) for the project. [`Open in CodeSandbox`](https://codesandbox.io/s/github/kktjs/kkt/tree/master/example/react-router)
- [**`scss`**](https://github.com/kktjs/kkt/tree/master/example/scss) - Use an example of `Scss`. [`Open in CodeSandbox`](https://codesandbox.io/s/github/kktjs/kkt/tree/master/example/scss)
- [**`stylus`**](https://github.com/kktjs/kkt/tree/master/example/stylus) - Use an example of `Stylus`. [`Open in CodeSandbox`](https://codesandbox.io/s/github/kktjs/kkt/tree/master/example/stylus)
- [**`typescript`**](https://github.com/kktjs/kkt/tree/master/example/typescript) - Use an example of `TypeScript`. [`Open in CodeSandbox`](https://codesandbox.io/s/github/kktjs/kkt/tree/master/example/typescript)
- [**`uiw`**](https://github.com/kktjs/kkt/tree/master/example/uiw) - Use [`uiw`](https://uiwjs.github.io/) for the project. [`Open in CodeSandbox`](https://codesandbox.io/s/github/kktjs/kkt/tree/master/example/uiw)


## How to rewire your create-react-app project

> Create your app using [create-react-app](https://github.com/facebook/create-react-app) and then rewire it.

```shell
npm install kkt --save-dev
```

```diff
"dependencies": {
  ...
-  "react-scripts": "4.0.1",
+  "kkt": "7.0.6",
  ....
},
"scripts": {
-  "start": "react-scripts start",
+  "start": "kkt start",
-  "build": "react-scripts build",
+  "build": "kkt build",
-  "test": "react-scripts test",
+  "test": "kkt test",
-  "eject": "react-scripts eject"
},
```

⚠️ Note: Do NOT flip the call for the eject script. That gets run only once for a project, after which you are given full control over the webpack configuration making `kkt` no longer required. There are no configuration options to rewire for the eject script.

```shell
# Start the Dev Server
$ npm start
# Build your app
$ npm run build
```

## Configuration File

Supports `.kktrc.js` and `.kktrc.ts`.

```typescript
import express from 'express';
import WebpackDevServer from 'webpack-dev-server';
import { LoaderConfOptions, MockerAPIOptions, DevServerOptions, WebpackConfiguration } from 'kkt';

type KKTRC = {
  proxySetup?: (app: express.Application) => MockerAPIOptions;
  devServer?: (config: WebpackDevServer.Configuration, options: DevServerOptions) => WebpackDevServer.Configuration;
  default?: (conf: WebpackConfiguration, evn: string, options: LoaderConfOptions) => WebpackConfiguration | Promise<WebpackConfiguration>;
};
```

Example

```typescript
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import lessModules from '@kkt/less-modules';
import { LoaderConfOptions, WebpackConfiguration } from 'kkt';

export default (conf: WebpackConfiguration, env: string, options: LoaderConfOptions) => {
  // The Webpack config to use when compiling your react app for development or production.
  // ...add your webpack config
  conf = lessModules(conf, env, options);
  return conf;
}

/**
 * Modify WebpackDevServer Configuration Example
 */
export const devServer = (config: WebpackDevServer.Configuration) => {
  // Change the https certificate options to match your certificate, using the .env file to
  // set the file paths & passphrase.
  const fs = require('fs');
  config.https = {
    key: fs.readFileSync(process.env.REACT_HTTPS_KEY, 'utf8'),
    cert: fs.readFileSync(process.env.REACT_HTTPS_CERT, 'utf8'),
    ca: fs.readFileSync(process.env.REACT_HTTPS_CA, 'utf8'),
    passphrase: process.env.REACT_HTTPS_PASS
  };
  // Return your customised Webpack Development Server config.
  return config;
};
```

Configuring the Proxy Manually.

```typescript
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { LoaderConfOptions, WebpackConfiguration, MockerAPIOptions } from 'kkt';
export default (conf: WebpackConfiguration, evn: 'development' | 'production') => {
  //....
  conf.proxySetup = (app: express.Application): MockerAPIOptions => {
    app.use('/api', createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    }));
    return {
      path: path.resolve('./mocker/index.js'),
    };
  };
  return conf;
}
```

Or use another way to manually configure the proxy.

```typescript
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { MockerAPIOptions } from 'kkt';
/**
 * Still available, may be removed in the future. (仍然可用，将来可能会被删除。) 
 */
export const proxySetup = (app: express.Application): MockerAPIOptions => {
  app.use('/api', createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true,
  }));
  /**
   * Mocker API Options
   * https://www.npmjs.com/package/mocker-api
   */
  return {
    path: path.resolve('./mocker/index.js'),
    option: {
      proxy: {
        '/repos/(.*)': 'https://api.github.com/',
      },
      changeHost: true,
    }
  }
}
```

## Command Help

```bash
Usage: kkt [start|build|test] [--help|h]

Displays help information.

Options:

  --version, -v Show version number
  --help, -h Displays help information.
  --app-src, Specify the entry directory.
  --no-open-browser, Do not open in browser.
  --no-clear-console, Do not clear the command line information.

Example:

$ kkt build
$ kkt build --app-src ./website
$ kkt start
$ kkt start --no-open-browser
$ kkt start --no-clear-console
$ kkt start --app-src ./website
$ kkt test
```

### Home Page

Add `homepage` to `package.json`

> The step below is important!

Open your package.json and add a homepage field for your project:

```json
"homepage": "https://myusername.github.io/my-app",
```

or for a GitHub user page:

```json
"homepage": "https://myusername.github.io",
```

or for a custom domain page:

```json
"homepage": "https://mywebsite.com",
```

KKT uses the `homepage` field to determine the root URL in the built HTML file.

### Plugins & Loader

- [@kkt/less-modules](https://github.com/kktjs/kkt/tree/master/packages/less-modules)
- ~~[@kkt/mocker-api](https://github.com/kktjs/kkt/tree/v6/packages/mocker-api)~~
- [@kkt/raw-modules](https://github.com/kktjs/kkt/tree/master/packages/raw-modules)
- [@kkt/react-library](https://github.com/kktjs/kkt/tree/master/packages/react-library)
- [@kkt/scope-plugin-options](https://github.com/kktjs/kkt/tree/master/packages/scope-plugin-options)
- [@kkt/stylus-modules](https://github.com/kktjs/kkt/tree/master/packages/stylus-modules)

### Development

Runs the project in development mode.  

```bash
# npm run bootstrap
npm run hoist
npm run build

npm run lib:watch
npm run kkt:watch

npm run hoist
```

### Production

Builds the app for production to the build folder.

```bash
npm run build
```

### Acknowledgements

[@timarney](https://github.com/timarney) for having created [react-app-rewired](https://github.com/timarney/react-app-rewired).

**Alternatives**

- [rescripts](https://github.com/rescripts/rescripts), an alternative framework for extending CRA configurations (supports 2.0+).
- [react-scripts-rewired](https://github.com/marcopeg/create-react-app/blob/master/packages/react-scripts/README.md) for a fork of this project that aims to support CRA 2.0
- [craco](https://github.com/sharegate/craco) Create React App Configuration Override, an easy and comprehensible configuration layer for create-react-app.
- [react-app](https://github.com/kriasoft/react-app) Create React App with server-side code support.
- [create-react-app-esbuild](https://github.com/pradel/create-react-app-esbuild) Use esbuild in your create-react-app for faster compilation, development and tests.

## Contributors

<a href="https://github.com/kktjs/kkt/graphs/contributors">
  <img src="https://kktjs.github.io/kkt/CONTRIBUTORS.svg" />
</a>

## License

[MIT © Kenny Wong](https://github.com/kktjs/kkt/blob/master/LICENSE)
