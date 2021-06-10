process.env.NODE_ENV = process.env.NODE_ENV || 'test';

import { ParsedArgs } from 'minimist';
import { reactScripts } from '../utils/path';

export interface Test extends ParsedArgs {}
export default async function test(argvs: Test) {
  try {
    // run original script
    require(`${reactScripts}/scripts/test`);
  } catch (error) {
    console.log('KKT:TEST:ERROR:', error);
  }
}
