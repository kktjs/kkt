import path from 'path';
import { ParsedArgs } from 'minimist';
import { reactScripts } from '../utils/path';

export default async (argvs: ParsedArgs): Promise<any> => {
  const pathsConfPath = `${reactScripts}/config/paths`;
  const pathsConf = require(pathsConfPath);

  const oldAppSrc = pathsConf.appSrc;
  if (argvs['app-src']) {
    pathsConf.appSrc = path.resolve(pathsConf.appPath, argvs['app-src']);
    Object.keys(pathsConf).forEach((keyname) => {
      if ((new RegExp(`^${oldAppSrc}`)).test(pathsConf[keyname])) {
        pathsConf[keyname] = pathsConf[keyname].replace(new RegExp(`^${oldAppSrc}`), pathsConf.appSrc);
      }
    });
  }
  // override config in memory
  require.cache[require.resolve(pathsConfPath)].exports = pathsConf;
}