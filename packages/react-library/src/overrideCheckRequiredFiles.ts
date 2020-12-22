
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { reactDevUtils } from 'kkt';

const checkRequiredPath = `${reactDevUtils}/checkRequiredFiles`;
require(checkRequiredPath);
if (require.cache && require.cache[require.resolve(checkRequiredPath)]) {
  /**
   * https://github.com/facebook/create-react-app/blob/7e4949a20fc828577fb7626a3262832422f3ae3b/packages/react-dev-utils/checkRequiredFiles.js
   */
  require.cache[require.resolve(checkRequiredPath)].exports = (files: string[]) => {
    let currentFilePath;
    try {
      files.forEach(filePath => {
        if (/(\.html)$/.test(filePath)) {
          return;
        }
        currentFilePath = filePath;
        fs.accessSync(filePath, (fs as any).F_OK);
      });
      return true;
    } catch (err) {
      var dirName = path.dirname(currentFilePath);
      var fileName = path.basename(currentFilePath);
      console.log(chalk.red('Could not find a required file.'));
      console.log(chalk.red('  Name: ') + chalk.cyan(fileName));
      console.log(chalk.red('  Searched in: ') + chalk.cyan(dirName));
      return false;
    }
  }
}

/**
 * 有可能不存在 public 导致的报错
 */
export const overrideCheckRequiredFiles = () => {}