<p align="center">
  <h1>@kkt/scope-plugin-options</h1>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@kkt/scope-plugin-options">
    <img src="https://img.shields.io/npm/v/@kkt/scope-plugin-options.svg">
  </a>
</p>

This will modify the CRA ModuleScopePlugin plugin that prevents to import modules from outside the `src` directory, useful if you use a different directory.

 This is the setting for the Plug-in `new ModuleScopePlugin`.
 
 Prevents users from importing files from outside of src/ (or node_modules/).
 This often causes confusion because we only process files within src/ with babel.
 To fix this, we prevent you from importing files out of src/ -- if you'd like to,
 please link the files into your node_modules/ and let module-resolution kick in.
 Make sure your source files are compiled, as they will not be processed in any way.
 
### Installation

```bash
yarn add --dev @kkt/scope-plugin-options
# or use npm if you don't have yarn yet
npm install --save-dev @kkt/scope-plugin-options
```

### Usage

In the `.kktrc.js` or `.kktrc.ts` you created for `kkt` add this code:

```js
import path from 'path';
import scopePluginOptions from '@kkt/scope-plugin-options';

export default (conf, evn, options) => {
  return scopePluginOptions(conf, evn, {
    allowedFiles: [
      path.resolve(process.cwd(), 'README.md')
    ]
  });
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
import scopePluginOptions from '@kkt/scope-plugin-options';

export default (conf, evn, options) => {
  return scopePluginOptions(conf, evn, {
    allowedFiles: [
      path.resolve(process.cwd(), 'README.md')
    ]
  });
}
```

### License

Licensed under the MIT License