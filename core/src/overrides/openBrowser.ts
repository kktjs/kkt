import { ParsedArgs } from 'minimist';
import { reactDevUtils } from '../utils/path';

function openBrowser() {}

export type OverridesOpenBrowserOptions = ParsedArgs;
/**
 * Disable openBrowser
 */
export function overridesOpenBrowser(options: OverridesOpenBrowserOptions) {
  if ((options && options['open-browser'] === false) || process.env.KKT_OPEN_BROWSER === 'true') {
    const openBrowserPath = `${reactDevUtils}/openBrowser`;
    require(openBrowserPath);
    // override config in memory
    require.cache[require.resolve(openBrowserPath)].exports = openBrowser;
  }
}
