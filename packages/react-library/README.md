<p align="center">
  <h1>@kkt/react-library</h1>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@kkt/react-library">
    <img src="https://img.shields.io/npm/v/@kkt/react-library.svg" alt="npm version">
  </a>
</p>

Use create-react-app to build react libraries. This gives you ability to reuse most of CRA setup for building your libraries.

### Installation

```bash
yarn add --dev @kkt/react-library
# or use npm if you don't have yarn yet
npm install --save-dev @kkt/react-library
```

### Usage

In the `.kktrc.js` or `.kktrc.ts` you created for `kkt` add this code:

```js
import path from 'path';
import reactLibrary from '@kkt/react-library';

export default (conf, evn, options) => {
  const pkg = require(path.join(process.cwd(), 'package.json'));

  return reactLibrary(conf, evn, {
    ...options,
    ...pkg,
    // webpack externals options
    dependencies: {
      ...pkg.dependencies,
      "react-refresh": "0"
    }
  });
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

- name: name of the library / package. 
- module: name of entry file for webpack. 
- main: output file for webpack config. 
- dependencies: list of dependencies to be added as externals to webpack config.

Although you can pass these options via configuration, it is usually recommended to package the package json config as is. For example:

```js
import path from 'path';
import reactLibrary from '@kkt/react-library';

export default (conf, evn, options) => {
  const pkg = require(path.join(process.cwd(), 'package.json'));
  return reactLibrary(conf, evn, {
    ...options,
    ...pkg,
    // webpack externals options
    dependencies: {
      ...pkg.dependencies,
      "react-refresh": "0"
    }
  });
}
```

### License

Licensed under the MIT License