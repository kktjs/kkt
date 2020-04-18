@kkt/loader-stylus
---

This package contains a plugin for using [stylus](https://github.com/stylus/stylus/) with [kkt](https://github.com/kktjs/kkt).


## Usage in kkt Projects

```bash
npm install @kkt/loader-stylus --dev
```

### With the loaderOneOf options

```js
// .kktrc.js
export const loaderOneOf = [
  require.resolve('@kkt/loader-stylus')
];
```
