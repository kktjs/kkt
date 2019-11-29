@kkt/loader-scss
---

This package contains a plugin for using [SCSS/SASS](https://sass-lang.com/) with [kkt](https://github.com/kktjs/kkt-next).


## Usage in kkt Projects

```bash
npm add @kkt/loader-scss --dev
```

### With the loaderOneOf options

```js
// .kktrc.js
export const loaderOneOf = [
  require.resolve('@kkt/loader-scss')
];
```
