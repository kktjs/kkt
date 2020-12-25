import path from 'path';
import fs from 'fs';
import semver from 'semver';
import minimist from 'minimist';

const args = process.argv.slice(2);
const argvs = minimist(args);

const projectDir = path.resolve(fs.realpathSync(process.cwd()));
const customOpts = require(path.resolve(projectDir, 'package.json'))['kkt'] || {};

/**
 *  默认从 package.json 指定配置文件目录和当前目录根目录 `.kktrc` 配置文件
 * 
 * {
 *   "kkt": {
 *     "path": "./config/kktrc"
 *   }
 * }
 */
let configOverrides = customOpts.path ? `${projectDir}/${customOpts.path}` : `${projectDir}/.kktrc`;

if (argvs['config-overrides']) {
  configOverrides = path.resolve(argvs['config-overrides']);
}

/** Package [`react-scripts`](http://npmjs.com/react-scripts) directory location */
const reactScripts = path.join(require.resolve('react-scripts/package.json'), '..');
/** Package [`react-dev-utils`](http://npmjs.com/react-dev-utils) directory location */
const reactDevUtils = path.join(require.resolve('react-dev-utils/package.json'), '..');
const paths = require(`${reactScripts}/config/paths`);
// 缓存当前配置
const configOverridesCache = path.resolve(projectDir, 'node_modules/.cache/kkt/.kktrc.js');
/** overrides proxySetup path */
const proxySetup = path.resolve(__dirname, './proxySetup.js');
const scriptPkg = require(`${reactScripts}/package.json`);

/**
 * 判断是否大于 2.1.2
 * CRA 2.1.2 switched to using a webpack config factory
 * https://github.com/facebook/create-react-app/pull/5722
 * https://github.com/facebook/create-react-app/releases/tag/v2.1.2
 */
const isWebpackFactory = semver.gte(scriptPkg && scriptPkg.version, '2.1.2');

export {
  proxySetup,
  projectDir,
  reactScripts,
  reactDevUtils,
  configOverrides,
  configOverridesCache,
  isWebpackFactory,
  paths
}
