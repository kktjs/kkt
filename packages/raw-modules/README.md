<p align="center">
  <h1>@kkt/raw-modules</h1>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@kkt/raw-modules">
    <img src="https://img.shields.io/npm/v/@kkt/raw-modules.svg" alt="npm version">
  </a>
</p>

Makes it easy to use the webpack raw-loader

### Installation

```bash
yarn add --dev @kkt/raw-modules
# or use npm if you don't have yarn yet
npm install --save-dev @kkt/raw-modules
```

### Usage

In the `.kktrc.js` or `.kktrc.ts` you created for `kkt` add this code:

```js
import path from 'path';
import rawModules from '@kkt/raw-modules';

export default (conf, evn, options) => {
  return rawModules(conf, evn, options);
}
```

In `package.json`, add a separate npm script to build library

```js
{
  "scripts": {
    ...
    "build": "kkt build",
    "start": "kkt start",
    ...
  }
}
```

And you can now use CRA to build your library

### Configurations

```js
import path from 'path';
import rawModules from '@kkt/raw-modules';

export default (conf, evn, options) => {
  return rawModules(conf, evn, {
    /**
     * test @defalut /\.md$/i 
     **/
    test: /\.(txt|md)$/i,
    /**
     * esModule @defalut true 
     **/
    esModule: false,
  });
}
```

### License

Licensed under the MIT License