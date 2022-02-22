Basic Example for bundle-node
===

Simple CLI for compiling a Node.js module into a single file, together with all its dependencies, gcc-style. A tool created based on [`kkt`](https://github.com/kktjs/kkt) & [`create-react-app`](https://github.com/facebook/create-react-app), [`@kkt/ncc`] similar to [@vercel/ncc](https://www.npmjs.com/package/@vercel/ncc)

## Quick Start

```bash
$ npx create-kkt my-app -e bundle-node
cd my-app
npm install
```

**production**

Builds the app for production to the build folder.

```bash
npm run build
```
