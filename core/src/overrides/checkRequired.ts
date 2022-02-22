import fs from 'fs';
import path from 'path';
import 'react-dev-utils/checkRequiredFiles';
import { reactDevUtils } from '../utils/path';
import { OverridePaths } from './paths';

/**
 * Fix `--app-src ./website`
 * [create-react-app/react-dev-utils/checkRequiredFiles.js](https://github.com/facebook/create-react-app/blob/0f6fc2bc71d78f0dcae67f3f08ce98a42fc0a57c/packages/react-dev-utils/checkRequiredFiles.js#L14-L30)
 */
export function checkRequiredFiles(paths: OverridePaths, isNotCheckHTML: boolean) {
  const checkRequiredFilesPath = `${reactDevUtils}/checkRequiredFiles`;
  require.cache[require.resolve(checkRequiredFilesPath)].exports = (files: fs.PathLike[]) => {
    files = files
      .map((item) => {
        if (/(\.html)$/.test(item as string) && isNotCheckHTML) {
          return;
        }
        if (paths._oldPaths && item === paths._oldPaths.appIndexJs) {
          return paths.appIndexJs;
        }
        return item;
      })
      .filter(Boolean);
    let currentFilePath;
    try {
      files.forEach((filePath) => {
        currentFilePath = filePath;
        fs.accessSync(filePath, fs.constants.F_OK);
      });
      return true;
    } catch (err) {
      const dirName = path.dirname(currentFilePath);
      const fileName = path.basename(currentFilePath);
      console.log('\x1b[1;31m Could not find a required file. \x1b[0m');
      console.log(`\x1b[1;31m   Name:  \x1b[0m ${fileName}`);
      console.log(`\x1b[1;31m   Searched in: \x1b[0m \x1b[1;36m${dirName}\x1b[0m`);
      return false;
    }
  };
}
