

/**
 * webpack loader
 */

/**
 * Default loader
 * @param {Object} loader
 * Default loader Object
 * {
 *   url: [Function],
 *   babel: [Function],
 *   css: [Function],
 *   file: [Function]
 * }
 */
export function loaderDefault(loader) {
  // {
  //   url: [Function],
  //   babel: [Function],
  //   css: [Function],
  //   file: [Function]
  // }
  return loader;
} 

export const loaderOneOf = [
  [require.resolve('@kkt/loader-less'), {} ],
]

/**
 * webpack config
 */
export default (conf) => {
  console.log('~~:', conf.module.rules[1]);
  return conf;
}
