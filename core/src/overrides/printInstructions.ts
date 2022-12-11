import chalk from 'chalk';
import { reactDevUtils } from '../utils/path';
import { getDocsData } from '../plugins/staticDoc';
import { DevServerOptions } from '../utils/loaderConf';
import { StartArgs } from '..';

/**
 * Try to get the client `port:3000` after startup
 * - `<APP Root>/node_modules/react-dev-utils/WebpackDevServerUtils.js`
 * - [create-react-app/react-dev-utils/WebpackDevServerUtils.js](https://github.com/facebook/create-react-app/blob/d960b9e38c062584ff6cfb1a70e1512509a966e7/packages/react-dev-utils/WebpackDevServerUtils.js#L78-L101)
 */
export function overridesPrintInstructions(opt: StartArgs & DevServerOptions) {
  const WebpackDevServerUtilsPath = `${reactDevUtils}/WebpackDevServerUtils`;
  const devServerUtils = require(WebpackDevServerUtilsPath);
  const { createCompiler } = devServerUtils;
  devServerUtils.createCompiler = (option: any) => {
    if (opt.docs) {
      const { route } = getDocsData(opt.docs);
      option.urls.localUrlForTerminal += `\n  ${chalk.bold('Docs Local:')}       ${
        option.urls?.localUrlForTerminal
      }${route}\n`;
      option.urls.lanUrlForTerminal += `\n  ${chalk.bold('Docs On Your Network:')}   ${
        option.urls?.lanUrlForTerminal
      }${route}\n`;
    }
    return createCompiler(option);
  };
  require.cache[require.resolve(WebpackDevServerUtilsPath)].exports = devServerUtils;
}
