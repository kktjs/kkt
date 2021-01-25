import { reactDevUtils } from '../utils/path';
import { cacheData } from '../utils/cacheData';

/**
 * Try to get the client `port:3000` after startup
 * - `<APP Root>/node_modules/react-dev-utils/WebpackDevServerUtils.js`
 * - [create-react-app/react-dev-utils/WebpackDevServerUtils.js](https://github.com/facebook/create-react-app/blob/0f6fc2bc71d78f0dcae67f3f08ce98a42fc0a57c/packages/react-dev-utils/WebpackDevServerUtils.js#L448-L493)
 */
export function overridesChoosePort(port?: number) {
  const WebpackDevServerUtilsPath = `${reactDevUtils}/WebpackDevServerUtils`;
  const devServerUtils = require(WebpackDevServerUtilsPath);
  const { choosePort } = devServerUtils;
  devServerUtils.choosePort = (host: string, defaultPort: number) => {
    return new Promise(async (resolve) => {
      if (port) {
        resolve(port);
      }
      const currentPort = await choosePort(host, defaultPort);
      cacheData({ port: currentPort, defaultPort });
      resolve(currentPort);
    });
  }
  require.cache[require.resolve(WebpackDevServerUtilsPath)].exports = devServerUtils;
}