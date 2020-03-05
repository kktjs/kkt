React Component Example.
===

Create a project for the React component library containing a website preview of the component library instance. The documents and component libraries are put into a project, the component library source files are added to the `button` directory, and the document website source files are added to the `src` directory.

## Quick Start

```bash
$ npx create-kkt my-app -e react-component
# React Component
cd ./button
npm install

cd my-app
npm install
```

**development**

Runs the project in development mode.  

listen to the component compile and output the .js file

```bash
cd ./button
npm install

npm run watch
```

```bash
npm run start
```

**production**

Builds the app for production to the build folder.

```bash
cd ./button
npm run build

cd ../
npm run build
```

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!
