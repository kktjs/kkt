import { ParsedArgs } from 'minimist';
import { reactDevUtils } from '../utils/path';

function clearConsole() {}

export type OverridesClearConsoleOptions = ParsedArgs;
/**
 * Do not clear the command line information.
 * - `node_modules/react-dev-utils/clearConsole.js`
 * - [create-react-app/react-dev-utils/clearConsole.js](https://github.com/facebook/create-react-app/blob/0f6fc2bc71d78f0dcae67f3f08ce98a42fc0a57c/packages/react-dev-utils/clearConsole.js#L10-L14)
 */
export function overridesClearConsole(options: OverridesClearConsoleOptions) {
  if ((options && options['clear-console'] === false) || process.env.KKT_CLEAR_CONSOLE === 'true') {
    const clearConsolePath = `${reactDevUtils}/clearConsole`;
    require(clearConsolePath);
    require.cache[require.resolve(clearConsolePath)].exports = clearConsole;
  }
}
