Docs Preview Example
---

The [react](https://github.com/facebook/react) base application.

## Quick Start

```bash
kkt start --docs @uiw/doc/web
kkt build
kkt doc --path ./build -p 30009
kkt doc --path @uiw/doc/web
kkt doc --path @uiw/doc/web:_uiw/doc --port 30002
kkt doc --path @uiw/doc/web:_uiw/doc -p 30002
kkt doc --path @uiw/doc/web:_uiw/doc -p 30002
kkt doc --path @uiw/react-native-doc/doc/build -p 30002
```

## Open in CodeSandbox

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?logo=codesandbox)](https://codesandbox.io/s/github/kktjs/kkt/tree/master/example/docs)

## Development

**development**

Runs the project in development mode.  

```bash
npm run start
```

**production**

Builds the app for production to the build folder.

```bash
npm run build
```

**test**

```bash
npm run test
npm run test:coverage
```

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!
