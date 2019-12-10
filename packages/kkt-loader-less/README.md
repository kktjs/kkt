@kkt/loader-less
---

This package contains a plugin for using [Less](https://github.com/less/less.js) with [kkt](https://github.com/kktjs/kkt-next).


## Usage in kkt Projects

```bash
npm install @kkt/loader-less --dev
```

### With the loaderOneOf options

```js
// .kktrc.js
export const loaderOneOf = [
  require.resolve('@kkt/loader-less')
];
```