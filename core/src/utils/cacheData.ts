import { KKTRC } from './loaderConf';

let data: CacheData = {};
type CacheData = {
  proxySetup?: KKTRC['proxySetup'];
}

/**
 * Cache data
 */
export const cacheData = (ops: CacheData) => {
  Object.keys(ops).forEach((keyname: keyof CacheData) => {
    data[keyname] = ops[keyname];
  });
}


/**
 * Get cache data
 */
export const getCacheData = () => {
  return data;
}