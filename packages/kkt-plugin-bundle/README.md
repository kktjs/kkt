@kkt/plugin-bundle
---

Package the UMD package for developing the React component library.

## Usage in kkt Projects

```bash
npm install @kkt/plugin-bundle --dev
```

### In kktrc.js

```js
import bundlePlugin from '@kkt/plugin-bundle';

export default (conf, options) => {
  conf = bundlePlugin(conf, options);
  /**
   * Do somthing
   */
  return conf;
}
```

Modify `package.json`

```diff
{
  "scripts": {
    "start": "kkt start",
    "build": "kkt build",
    "released": "npm run bundle && npm run bundle:min",
+    "bundle": "kkt build --bundle",
+    "bundle:min": "GENERATE_SOURCEMAP=false kkt build --bundle --mini --no-emptyDir",
    "test": "kkt test --env=jsdom",
    "test:coverage": "kkt test --env=jsdom --coverage"
  },
}
```