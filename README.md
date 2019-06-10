<p align="center">
  <a href="https://github.com/jaywcjlove/kkt">
    <img src="./website/kkt.svg?sanitize=true">
  </a>
</p>

<p align="center">
  <a href="https://github.com/jaywcjlove/kkt/issues">
    <img src="https://img.shields.io/github/issues/jaywcjlove/kkt.svg">
  </a>
  <a href="https://github.com/jaywcjlove/kkt/network">
    <img src="https://img.shields.io/github/forks/jaywcjlove/kkt.svg">
  </a>
  <a href="https://github.com/jaywcjlove/kkt/stargazers">
    <img src="https://img.shields.io/github/stars/jaywcjlove/kkt.svg">
  </a>
  <a href="https://github.com/jaywcjlove/kkt/releases">
    <img src="https://img.shields.io/github/release/jaywcjlove/kkt.svg">
  </a>
  <a href="https://www.npmjs.com/package/kkt">
    <img src="https://img.shields.io/npm/v/kkt.svg">
  </a>
</p>


Create React apps with no build configuration, Cli tool for creating react apps. Another tool, [`kkt-ssr`](https://github.com/jaywcjlove/kkt-ssr), Is a lightweight framework for static and server-rendered applications.

## Usage

You will need [`Node.js`](https://nodejs.org) installed on your system.

```bash
npm install -g kkt
kkt create my-app # create project
```

## Quick Start

```bash
npx kkt create my-app
cd my-app
npm start
```

You can also initialize a project from one of the examples. Example from [jaywcjlove/kkt](./example) example-path. 

```bash
# Using the template method
npx kkt create my-app -e rematch
```

or

```bash
npm install -g kkt
# Create project, Using the template method
kkt create my-app -e rematch
cd my-app # Enter the directory
npm start # Start service
```


## KKT Help

```bash
Usage: kkt <command> [options]

Rapid React development, Cli tool for creating react apps.

Options:
  -v, --version                output the version number
  -h, --help                   output usage information

Commands:
  create [options] <app-name>  create a new project powered by kkt
  build [options]              Builds the app for production to the dist folder.
  start                        Will create a web server, Runs the app in development mode.
  watch                        Does not provide web server, Listen only for file change generation files
  test [options]               Runs the app in development mode.
  deploy [options]             Push the specified directory to the gh-pages branch.

  Examples:

    $ kkt start
    $ kkt build
    $ kkt watch
    $ kkt test --env=jsdom
    $ kkt test --env=jsdom --coverage
```

create options

```
Usage: create [options] <app-name>

create a new project powered by kkt

Options:
  -e, --example <example-path>  Example from https://github.com/jaywcjlove/kkt/tree/master/example example-path (default: "default")
  -r, --registry <url>          Use specified npm registry when installing dependencies (only for npm)
  -f, --force                   Overwrite target directory if it exists
  -h, --help                    output usage information

  Examples:

    # create a new project with an official template
    $ kkt create my-project
    $ kkt create my-project --example rematch
    $ kkt create my-project -e rematch
```

build options

```
Usage: build [options]

Builds the app for production to the dist folder.

Options:
  -b, --bundle [value]    Bundles a minified and unminified version.
  -e, --emptyDir [value]  Empty the DIST directory before compiling. (default: true)
  --no-emptyDir           Empty the DIST directory before compiling.
  -h, --help              output usage information
```

## Config

```js
module.exports = {
  babel: Function,
  babelInclude: Array,
  config: Function,
  plugins: Array,
}
```

## Webpack Config

<details>
<summary>Modify the Webpack configuration</summary>

```js
module.exports = {
  config: (conf, { dev, env }, webpack) => {
    if (dev) {
      conf.devServer.before = (app) => {
        apiMocker(app, path.resolve('./mocker/index.js'), {
          proxy: {
            '/repos/*': 'https://api.github.com/',
          },
          changeHost: true,
        });
      };
    }
    // or
    if (conf.mode === 'development') {
      // Webpack configuration changed in `development` mode
    }
    if (conf.mode === 'production') {
      // Webpack configuration changed in `production` mode
    }
    return conf;
  },
};
```

</details>

<details>
<summary>Add a Rules configuration</summary>

```js
module.exports = {
  config: (conf, { dev, env }, webpack) => {
    conf.module.rules = [
      ...conf.module.rules,
      {
        test: /\.md$/,
        loader: 'raw-loader',
      },
    ]
    return conf;
  },
};
```

</details>

<details>
<summary>Add a plugins configuration</summary>

```js
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  config: (conf, { dev, env }, webpack) => {
    conf.plugins = [
      ...conf.plugins,
      new CleanWebpackPlugin(paths.appBuildDist, {
        root: process.cwd(),
      }),
    ]
    return conf;
  },
};
```

</details>

<details>
<summary>devServer.https - Enable HTTPS</summary>

```js
module.exports = {
  config: (conf, { dev, env }, webpack) => {
    if (dev) {
      conf.devServer.https = true;
    }
    return conf;
  },
};
```

</details>

<details>
<summary>devServer.proxy - Use the Webpack proxy</summary>

```js
const path = require('path');
const apiMocker = require('mocker-api');

module.exports = {
  // Modify the webpack config
  config: (conf, { dev, env }, webpack) => {
    if (env === 'prod') {
    }
    if (dev) {
      conf.devServer.proxy = {
        '/api': {
          target: 'http://127.0.0.1:1130',
          changeOrigin: true,
        },
        // websokect proxy
        '/api/ws': {
          target: 'ws://localhost:9981',
          ws: true
        },
      }
    }
    return conf;
  },
};
```

</details>

## Mock API

Use the [`mocker-api`](https://github.com/jaywcjlove/mocker-api) simulation API. Add the `mocker/index.js` file to the project root directory

```js
const proxy = {
  'GET /api/user': { id: 1, username: 'kenny', sex: 6 },
  'GET /api/user/list': [
    { id: 1, username: 'kenny', sex: 6 }, 
    { id: 2, username: 'kkt', sex: 6 }
  ],
  'POST /api/login/account': (req, res) => {
    const { password, username } = req.body;
    if (password === '888888' && username === 'admin') {
      return res.json({
        status: 'ok',
        code: 0,
        token: "kkt",
        data: { id: 1, username: 'kktname', sex: 6 }
      });
    } else {
      return res.json({
        status: 'error',
        code: 403
      });
    }
  }
}
module.exports = proxy;
```

Load the `mocker` configuration.

```js
const path = require('path');
const apiMocker = require('mocker-api');

module.exports = {
  // Modify the webpack config
  config: (conf, { dev, env }, webpack) => {
    if (env === 'prod') {
    }
    if (dev) {
      conf.devServer.before = (app) => {
        apiMocker(app, path.resolve('./mocker/index.js'), {
          proxy: {
            '/repos/*': 'https://api.github.com/',
          },
          changeHost: true,
        });
      };
    }
    return conf;
  },
};
```

## Example

Initialize the project from one of the examples:

```bash
$ npx kkt create my-app -e `<Example Name>`
```

- [**`default`**](example/default) - The [react](https://github.com/facebook/react) base application.
- [**`chrome-plugin`**](example/chrome-plugin) - For chrome browser plugin development example.
- [**`bundle`**](example/bundle) - For chrome browser plugin development.
- [**`typescript`**](example/typescript) - Use an example of `typescript`.
- [**`less`**](example/less) - Use an example of `less`.
- [**`scss`**](example/scss) - Use an example of `scss`.
- [**`markdown`**](example/markdown) - Use an example of `markdown`.
- [**`react-component`**](example/react-component) - Create a project for the react component library.
- [**`rematch`**](example/rematch) - Use `rematch` for the project.
- [**`uiw`**](example/uiw) - Use `uiw` for the project.

## License

[MIT © Kenny Wong](./LICENSE)
