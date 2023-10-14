import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

/**
 * Checked `paths.appHtml`, `paths.appIndexJs`
 * https://github.com/facebook/create-react-app/blob/7e4949a20fc828577fb7626a3262832422f3ae3b/packages/react-dev-utils/checkRequiredFiles.js
 */
export const checkRequiredFiles = (files: string[], isNotCheckHTML = true) => {
  let currentFilePath;
  try {
    files.forEach((filePath) => {
      if (/(\.html)$/.test(filePath) && isNotCheckHTML) {
        return;
      }
      currentFilePath = filePath;
      fs.accessSync(filePath, (fs as any).F_OK);
    });
    return true;
  } catch (err) {
    if (currentFilePath) {
      const dirName = path.dirname(currentFilePath);
      const fileName = path.basename(currentFilePath);
      console.log(chalk.red('Could not find a required file.'));
      console.log(chalk.red('  Name: ') + chalk.cyan(fileName));
      console.log(chalk.red('  Searched in: ') + chalk.cyan(dirName));
    }
    return false;
  }
};
