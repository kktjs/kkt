<p align="center">
  <h1>@kkt/stylus-modules</h1>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@kkt/stylus-modules">
    <img src="https://img.shields.io/npm/v/@kkt/stylus-modules.svg" alt="npm version">
  </a>
</p>

Use create-react-app to build react libraries. Support for regular `styl` files and `*.module.styl` files. This package contains a plugin for using [stylus](https://github.com/stylus/stylus/) with [kkt](https://github.com/kktjs/kkt).

### Installation

```bash
yarn add --dev @kkt/stylus-modules
# or use npm if you don't have yarn yet
npm install --save-dev @kkt/stylus-modules
```

### Usage

In the `.kktrc.js` or `.kktrc.ts` you created for `kkt` add this code:

```js
import stylusModules from '@kkt/stylus-modules';

export default (conf, evn, options) => {
  conf = stylusModules(conf, evn, options);
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
import stylusModules from '@kkt/stylus-modules';

export default (conf, evn, options) => {

  // with loaderOptions
  conf = stylusModules.withLoaderOptions({
    stylusOptions: {
      // Specify the path. where to find files
      paths: ["node_modules/vars"],
    },
  })(conf, env, options);

  return conf;
}
```

### License

Licensed under the MIT License