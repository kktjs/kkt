@kkt/loader-less
---

This package contains a plugin for using [Less](https://github.com/less/less.js) with [kkt](https://github.com/kktjs/kkt).


## Usage in kkt Projects

```bash
npm add @kkt/loader-less --dev
```

### With the loaderOneOf options

```js
// .kktrc.js
export const loaderOneOf = [
  require.resolve('@kkt/loader-less')
];
```
