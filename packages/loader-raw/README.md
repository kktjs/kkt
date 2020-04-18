@kkt/loader-raw
---

A loader for webpack that allows importing files as a String. The .md file is loaded by default.

## Usage in kkt Projects

```bash
npm install @kkt/loader-raw --save-dev
```

### With the loaderOneOf options

```js
// .kktrc.js
export const loaderOneOf = [
  // The .md file is loaded by default.
  require.resolve('@kkt/loader-raw')
];
```

or

```js
// .kktrc.js
export const loaderOneOf = [
  [require.resolve('@kkt/loader-raw'), {
    ext: ['md', 'txt'],
    esModule: false,
  }]
];
```