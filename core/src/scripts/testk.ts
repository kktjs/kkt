process.env.NODE_ENV = process.env.NODE_ENV || 'test';

import { reactScripts } from '../utils/path';
import { TestArgs } from '..';

export default async function test(argvs: TestArgs) {
  try {
    // run original script
    require(`${reactScripts}/scripts/test`);
  } catch (error) {
    console.log('KKT:TEST:ERROR:', error);
  }
}
