import path from 'path';
import { ParsedArgs } from 'minimist';
import { reactScripts, Paths } from '../utils/path';

export type OverridePaths = Paths & {
  _oldPaths: OverridePaths;
};

/**
 * Override Paths
 * @param {ParsedArgs | undefined} argvs `argvs['app-src']`
 * @param {Record<string, string>} opts
 * - [create-react-app/react-scripts/react-scripts/config/paths.js](https://github.com/facebook/create-react-app/blob/0f6fc2bc71d78f0dcae67f3f08ce98a42fc0a57c/packages/react-scripts/config/paths.js#L83-L105)
 */
export const overridePaths = (argvs?: ParsedArgs, opts: Record<string, string> = {}): OverridePaths => {
  const pathsConfPath = `${reactScripts}/config/paths`;
  const pathsConf = require(pathsConfPath);
  const _oldPaths = { ...pathsConf };
  if (opts) {
    Object.keys(pathsConf).forEach((keyname) => {
      if (opts && opts[keyname]) {
        pathsConf[keyname] = opts[keyname];
      }
    });
  }
  if (argvs && argvs['app-src']) {
    const oldAppSrc = pathsConf.appSrc;
    pathsConf.appSrc = path.resolve(pathsConf.appPath, argvs['app-src']);
    Object.keys(pathsConf).forEach((keyname) => {
      if (typeof pathsConf[keyname] === 'string' && pathsConf[keyname].startsWith(oldAppSrc)) {
        pathsConf[keyname] = pathsConf[keyname].replace(oldAppSrc, pathsConf.appSrc);
      }
    });
  }
  // override config in memory
  require.cache[require.resolve(pathsConfPath)].exports = pathsConf;
  return { ...pathsConf, _oldPaths };
};
