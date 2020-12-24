<p align="center">
  <h1>@kkt/mocker-api</h1>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@kkt/mocker-api">
    <img src="https://img.shields.io/npm/v/@kkt/mocker-api.svg">
  </a>
</p>

[`mocker-api`](https://github.com/jaywcjlove/mocker-api) that creates mocks for REST APIs.

### Installation

```bash
yarn add --dev @kkt/mocker-api
# or use npm if you don't have yarn yet
npm install --save-dev @kkt/mocker-api
```

### Usage

In the `.kktrc.js` or `.kktrc.ts` you created for `kkt` add this code:

```js
import path from 'path';
import apiMocker from '@kkt/mocker-api';

export const devServer = (configFunction) => {
  return (proxy, allowedHost) => {
    // Create the default config by calling configFunction with the proxy/allowedHost parameters
    let config = configFunction(proxy, allowedHost);
    
    config = apiMocker(config, path.resolve('./mocker/index.js'));

    // Return your customised Webpack Development Server config.
    return config;
  }
}
```

In `package.json`, add a separate npm script to build library

```js
{
  "scripts": {
    ...
    "start": "kkt start",
    ...
  }
}
```

And you can now use CRA to build your library

### Configurations

```js

import path from 'path';
import apiMocker from '@kkt/mocker-api';

export const devServer = (configFunction) => (proxy, allowedHost) => {
  // Create the default config by calling configFunction with the proxy/allowedHost parameters
  let config = configFunction(proxy, allowedHost);
  config = apiMocker(
    config,
    path.resolve('./mocker/index.js'),
    /**
     * mocker-api Options
     * https://github.com/jaywcjlove/mocker-api/tree/6503e44d0c8fe1d833d6f367ccbb7630415f555c#options
     */
    {
      proxy: {
        // Turn a path string such as `/user/:name` into a regular expression.
        // https://www.npmjs.com/package/path-to-regexp
        '/repos/(.*)': 'https://api.github.com/',
        '/:owner/:repo/raw/:ref/(.*)': 'http://127.0.0.1:2018',
        '/api/repos/(.*)': 'http://127.0.0.1:3721/'
      },
      // rewrite target's url path. Object-keys will be used as RegExp to match paths.
      // https://github.com/jaywcjlove/mocker-api/issues/62
      pathRewrite: {
        '^/api/repos/': '/repos/',
      },
      changeHost: true,
      // modify the http-proxy options
      httpProxy: {
        options: {
          ignorePath: true,
        },
        listeners: {
          proxyReq: function (proxyReq, req, res, options) {
            console.log('proxyReq');
          },
        },
      },
    }
  );

  // Return your customised Webpack Development Server config.
  return config;
}
```

### License

Licensed under the MIT License