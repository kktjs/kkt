<p align="center">
  <a href="https://github.com/kktjs/kkt-next">
    <img src="https://raw.githubusercontent.com/kktjs/kkt/d2bb00dc2d0bd9bb133f3a369d0ad2f5330ed4af/website/kkt.svg?sanitize=true">
  </a>
</p>

<p align="center">
  <a href="https://github.com/kktjs/kkt-next/issues">
    <img src="https://img.shields.io/github/issues/kktjs/kkt-next.svg">
  </a>
  <a href="https://github.com/kktjs/kkt-next/network">
    <img src="https://img.shields.io/github/forks/kktjs/kkt-next.svg">
  </a>
  <a href="https://github.com/kktjs/kkt-next/stargazers">
    <img src="https://img.shields.io/github/stars/kktjs/kkt-next.svg">
  </a>
  <a href="https://github.com/kktjs/kkt-next/releases">
    <img src="https://img.shields.io/github/release/kktjs/kkt-next.svg">
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
  yargsArgs: IMyYargsArgs; // Command Parameter
  paths: {
    moduleFileExtensions: string[];
  };
  // conf.resolve.plugins `ModuleScopePlugin` options.
  moduleScopePluginOpts?: KKTRC['moduleScopePluginOpts'];
}
export default (conf: webpack.Configuration, options: OptionConf, webpack: typeof webpack) => {
  return conf;
}
```

## License

[MIT © Kenny Wong](./LICENSE)