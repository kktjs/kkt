import { ParsedArgs } from 'minimist';
import { reactDevUtils } from '../utils/path';

export type OverridesClearConsoleOptions = ParsedArgs;
/**
 * Do not clear the command line information.
 */
export function overridesClearConsole(options: OverridesClearConsoleOptions) {
  if ((options && options['no-clear-console']) || process.env.KKT_CLEAR_CONSOLE === 'true') {
    const clearConsolePath = `${reactDevUtils}/clearConsole`;
    require(clearConsolePath);
    require.cache[require.resolve(clearConsolePath)].exports = () => {};
  }
}
