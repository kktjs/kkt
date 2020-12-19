import path from 'path';
import { ParsedArgs } from 'minimist';
import { reactScripts } from '../utils/path';


export const overridePaths = (argvs = undefined as ParsedArgs | undefined, opts: Record<string, string> = {}) => {
  const pathsConfPath = `${reactScripts}/config/paths`;
  const pathsConf = require(pathsConfPath);
  if (argvs && argvs['app-src']) {
    const oldAppSrc = pathsConf.appSrc;
    pathsConf.appSrc = path.resolve(pathsConf.appPath, argvs['app-src']);
    Object.keys(pathsConf).forEach((keyname) => {
      if ((new RegExp(`^${oldAppSrc}`)).test(pathsConf[keyname])) {
        pathsConf[keyname] = pathsConf[keyname].replace(new RegExp(`^${oldAppSrc}`), pathsConf.appSrc);
      }
    });
  } else if (opts) {
    Object.keys(pathsConf).forEach((keyname) => {
      if (opts && opts[keyname]) {
        pathsConf[keyname] = opts[keyname];
      }
    });
  }
  // override config in memory
  require.cache[require.resolve(pathsConfPath)].exports = pathsConf;
}