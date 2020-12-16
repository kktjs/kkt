React Component Example for TypeScript.
===

Create a project for the React component library containing a website preview of the component library instance. The documents and component libraries are put into a project, all written in `TypeScript`, the component library source files are added to the `src` directory, and the document website source files are added to the `website` directory.

## Quick Start

```bash
$ npx create-kkt my-app -e react-component-tsx
cd my-app
npm install
```

**development**

Runs the project in development mode.  

```bash
# Step 1, run first, listen to the component compile and output the .js file
# listen for compilation output type .d.ts file
npm run watch
# Step 2, development mode, listen to compile preview website instance
npm run start
```

**production**

Builds the app for production to the build folder.

```bash
npm run build
```

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!