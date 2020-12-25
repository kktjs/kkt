<p align="center">
  <h1>@kkt/less-modules</h1>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@kkt/less-modules">
    <img src="https://img.shields.io/npm/v/@kkt/less-modules.svg" alt="npm version">
  </a>
</p>

Use create-react-app to build react libraries. Support for regular less files and *.module.less files. This package contains a plugin for using [Less](https://github.com/less/less.js) with [kkt](https://github.com/kktjs/kkt).

### Installation

```bash
yarn add --dev @kkt/less-modules
# or use npm if you don't have yarn yet
npm install --save-dev @kkt/less-modules
```

### Usage

In the `.kktrc.js` or `.kktrc.ts` you created for `kkt` add this code:

```js
import lessModules from '@kkt/less-modules';

export default (conf, evn, options) => {
  conf = lessModules(conf, evn, options);

  // with loaderOptions
  conf = lessModules.withLoaderOptions({
    modifyVars: {
      "@primary-color": "#1890ff",
    },
  })(config, env, options);

  return conf;
}
```

In `package.json`, add a separate npm script to build library

```js
{
  "scripts": {
    ...
    "bundle": "kkt build --bundle",
    "bundle:min": "kkt build --bundle --mini",
    ...
  }
}
```

And you can now use CRA to build your library

### Configurations

```js
import lessModules from '@kkt/less-modules';

export default (conf, evn, options) => {

  // with loaderOptions
  conf = lessModules.withLoaderOptions({
    lessOptions: {
      modifyVars: {
        "@primary-color": "#1890ff",
      },
    }
  })(conf, env, options);

  return conf;
}
```

### License

Licensed under the MIT License