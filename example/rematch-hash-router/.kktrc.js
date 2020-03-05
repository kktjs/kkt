import path from 'path';

export const loaderOneOf = [
  [require.resolve('@kkt/loader-less'), {} ],
]

/**
 * webpack config
 */
export default (conf) => {
  // console.log('~~:', conf.module.rules[1]);
  return conf;
}

/**
 * mocker-api that creates mocks for REST APIs.
 * It will be helpful when you try to test your application without the actual REST API server.
 * https://github.com/jaywcjlove/mocker-api
 */
export const mocker = {
  path: path.resolve('./mocker/index.js'),
  /**
   * https://github.com/jaywcjlove/mocker-api/tree/96c2eb94694571e0e3003e6ad9ce1c809499f577#options
   */
  option: {

  },
}
