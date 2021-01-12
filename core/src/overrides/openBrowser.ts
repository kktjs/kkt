import { ParsedArgs } from 'minimist';
import { reactDevUtils } from '../utils/path';

/**
 * Disable openBrowser
 */
export default async (argvs: ParsedArgs): Promise<any> => {
  if (argvs && argvs['no-open-browser']) {
    const openBrowserPath = `${reactDevUtils}/openBrowser`;
    require(openBrowserPath);
    // override config in memory
    require.cache[require.resolve(openBrowserPath)].exports = () => {};
  }
};
