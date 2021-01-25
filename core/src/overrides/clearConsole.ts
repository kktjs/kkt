import { ParsedArgs } from 'minimist';
import { reactDevUtils } from '../utils/path';

function clearConsole() {}

export type OverridesClearConsoleOptions = ParsedArgs;
/**
 * Do not clear the command line information.
 * `node_modules/react-dev-utils/clearConsole.js`
 */
export function overridesClearConsole(options: OverridesClearConsoleOptions) {
  if ((options && options['clear-console'] === false) || process.env.KKT_CLEAR_CONSOLE === 'true') {
    const clearConsolePath = `${reactDevUtils}/clearConsole`;
    require(clearConsolePath);
    require.cache[require.resolve(clearConsolePath)].exports = clearConsole;
  }
}
