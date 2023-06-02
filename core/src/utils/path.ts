import path from 'path';
import fs from 'fs';
import semver from 'semver';
import minimist from 'minimist';

export type Paths = {
  dotenv: string;
  appPath: string;
  appBuild: string;
  appPublic: string;
  appHtml: string;
  appIndexJs: string;
  appPackageJson: string;
  /** App Root Path */
  appSrc: string;
  appTsConfig: string;
  appJsConfig: string;
  yarnLockFile: string;
  testsSetup: string;
  proxySetup: string;
  appNodeModules: string;
  swSrc: string;
  publicUrlOrPath: string;
  // These properties only exist before ejecting:
  ownPath: string;
  ownNodeModules: string;
  appTypeDeclarations: string;
  ownTypeDeclarations: string;
};

const args = process.argv.slice(2);
const argvs = minimist(args);

/** App Path */
const projectDir = path.resolve(fs.realpathSync(process.cwd()));

/**
 * Package [`react-scripts`](http://npmjs.com/react-scripts) directory location
 * - `<root path>/node_modules/react-scripts`
 */
const reactScripts = path.join(require.resolve('react-scripts/package.json'), '..');
/**
 * Package [`react-dev-utils`](http://npmjs.com/react-dev-utils) directory location
 * - `<root path>/node_modules/react-dev-utils`
 */
const reactDevUtils = path.join(require.resolve('react-dev-utils/package.json'), '..');
const paths: Paths = require(`${reactScripts}/config/paths`);

/**
 * Overrides proxySetup path
 * `<root path>/node_modules/kkt/lib/utils/proxySetup.js`
 */
const proxySetup = path.resolve(__dirname, './proxySetup.js');
/**
 * `<root path>/node_modules/react-scripts/package.json`
 */
const scriptPkg = require(`${reactScripts}/package.json`);

/**
 * 判断是否大于 2.1.2
 * CRA 2.1.2 switched to using a webpack config factory
 * https://github.com/facebook/create-react-app/pull/5722
 * https://github.com/facebook/create-react-app/releases/tag/v2.1.2
 */
const isWebpackFactory = semver.gte(scriptPkg && scriptPkg.version, '2.1.2');

export { proxySetup, projectDir, reactScripts, reactDevUtils, isWebpackFactory, paths };
