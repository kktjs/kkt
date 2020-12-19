process.env.NODE_ENV = process.env.NODE_ENV || 'test';

import { ParsedArgs } from 'minimist';
import { reactScripts } from '../utils/path';

export default async function build(argvs: ParsedArgs) {
  try {
    // run original script
    require(`${reactScripts}/scripts/test`);
  } catch (error) {
    console.log('KKT:TEST:ERROR:', error);
  }
}
