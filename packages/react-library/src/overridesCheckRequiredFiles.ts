import { reactDevUtils } from 'kkt';
import { checkRequiredFiles } from './checkRequiredFiles';

const checkRequiredPath = `${reactDevUtils}/checkRequiredFiles`;
require(checkRequiredPath);
if (require.cache && require.cache[require.resolve(checkRequiredPath)]) {
  require.cache[require.resolve(checkRequiredPath)]!.exports = checkRequiredFiles;
}
