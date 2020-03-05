<p align="center">
  <a href="https://github.com/kktjs/kkt">
    <img src="https://raw.githubusercontent.com/kktjs/kkt/d2bb00dc2d0bd9bb133f3a369d0ad2f5330ed4af/website/kkt.svg?sanitize=true">
  </a>
</p>

<p align="center">
  <a href="https://github.com/kktjs/kkt/issues">
    <img src="https://img.shields.io/github/issues/kktjs/kkt.svg">
  </a>
  <a href="https://github.com/kktjs/kkt/network">
    <img src="https://img.shields.io/github/forks/kktjs/kkt.svg">
  </a>
  <a href="https://github.com/kktjs/kkt/stargazers">
    <img src="https://img.shields.io/github/stars/kktjs/kkt.svg">
  </a>
  <a href="https://github.com/kktjs/kkt/releases">
    <img src="https://img.shields.io/github/release/kktjs/kkt.svg">
  </a>
  <a href="https://www.npmjs.com/package/kkt">
    <img src="https://img.shields.io/npm/v/kkt.svg">
  </a>
</p>

Create React apps with no build configuration, Cli tool for creating react apps. Another tool, [`kkt-ssr`](https://github.com/kktjs/kkt-ssr), Is a lightweight framework for static and server-rendered applications.

> [Migrate from kkt 4.x to 5.x](https://github.com/kktjs/kkt-next/issues/1).

### Features:

- ⏱ The code was rewritten using TypeScript.
- ♻️ Recompile the code when project files get added, removed or modified.
- 📚 Readable source code that encourages learning and contribution
- ⚛️ Refactor code based on [**create-react-app**](https://github.com/facebook/create-react-app).
- 💝 Expose the configuration file entry and support webpack configuration.
- 🚀 Supports [**creat-kkt**](https://github.com/kktjs/create-kkt) to create different instances.
- ⛑ Jest test runner setup with defaults `kkt test`

## Usage

You will need [`Node.js`](https://nodejs.org) installed on your system. 

```bash
npm install kkt
```

## Example

Initialize the project from one of the examples, Let's quickly create a react application:

```bash
$ npx create-kkt my-app -e uiw
# or npm
$ npm create kkt my-app -e `<Example Name>`
# or yarn 
$ yarn create kkt my-app -e `<Example Name>`
```

- [**`basic`**](example/basic) - The [react](https://github.com/facebook/react) base application.
- [**`bundle`**](example/bundle) - Package the UMD package for developing the React component library.
- [**`electron`**](example/electron) - Use an example of [`Electronjs`](https://github.com/electron).
- [**`less`**](example/less) - Use an example of `Less`.
- [**`markdown`**](example/markdown) - Use an example of `Markdown`.
- [**`react-component`**](example/react-component) - Create a project for the react component library.
- [**`react-component-tsx`**](example/react-component-tsx) - Create a project containing the website for the react component library.
- [**`rematch`**](example/rematch) - Use [`Rematch`](https://github.com/rematch/rematch) for the project.
- [**`scss`**](example/scss) - Use an example of `Scss`.
- [**`stylus`**](example/stylus) - Use an example of `Stylus`.
- [**`typescript`**](example/typescript) - Use an example of `TypeScript`.
- [**`uiw`**](example/uiw) - Use [`uiw`](https://uiwjs.github.io/) for the project.

## Configuration

Supports `kktrc.js` and `kktrc.ts`.

```ts
import { Argv } from 'yargs';

export interface ClientEnvironment {
  raw: {
    NODE_ENV?: 'development' | 'production' | string;
    PUBLIC_URL?: string;
    IMAGE_INLINE_SIZE_LIMIT?: string;
  },
  stringified: {
    'process.env': ClientEnvironment['raw'],
  },
}
export interface OptionConf {
  env: string; // Environment variable
  dotenv: ClientEnvironment;
  isEnvDevelopment: boolean;
  isEnvProduction: boolean;
  shouldUseSourceMap: boolean;
  publicPath: string;
  publicUrl: string;
  useTypeScript: boolean;
  yargsArgs: Argv; // Command Parameter
  paths: {
    moduleFileExtensions: string[];
  };
  // conf.resolve.plugins `ModuleScopePlugin` options.
  moduleScopePluginOpts?: KKTRC['moduleScopePluginOpts'];
}

/**
 * Modify webpack config.
 * */
export default (conf: webpack.Configuration, options: OptionConf, webpack: typeof webpack) => {
  return conf;
}

/**
 * This is the setting for the Plug-in `new ModuleScopePlugin`.
 * 
 * Prevents users from importing files from outside of src/ (or node_modules/).
 * This often causes confusion because we only process files within src/ with babel.
 * To fix this, we prevent you from importing files out of src/ -- if you'd like to,
 * please link the files into your node_modules/ and let module-resolution kick in.
 * Make sure your source files are compiled, as they will not be processed in any way.
 * */
export const moduleScopePluginOpts = [
  path.resolve(process.cwd(), 'README.md'),
];

/**
 * Support for Less.
 * Opt-in support for Less (using `.scss` or `.less` extensions).
 * By default we support Less Modules with the
 * extensions `.module.less` or `.module.less`
 **/
export const loaderOneOf = [
  require.resolve('@kkt/loader-less'), // Support for less.
  require.resolve('@kkt/loader-scss'), // Support for scss.
  require.resolve('@kkt/loader-stylus'), // Support for stylus.
];

/**
 * mocker-api that creates mocks for REST APIs.
 * It will be helpful when you try to test your application without the actual REST API server.
 * https://github.com/jaywcjlove/mocker-api
 */
export const mocker = {
  path: string | string[];
  /**
   * https://github.com/jaywcjlove/mocker-api/tree/96c2eb94694571e0e3003e6ad9ce1c809499f577#options
   */
  option: MockerOption;
}
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

### Loaders

- [@kkt/loader-less](packages/kkt-loader-less)
- [@kkt/loader-scss](packages/kkt-loader-scss)
- [@kkt/loader-stylus](packages/kkt-loader-stylus)

### Development

```bash
npm run watch:lib
npm run watch:kkt
```

## License

[MIT © Kenny Wong](./LICENSE)
