
declare module 'react-dev-utils/ModuleNotFoundPlugin' {
  import webpack = require('webpack');
  export default class ModuleNotFoundPlugin extends webpack.Plugin {
    constructor(nodeModulesPath: string);
  }
}

declare module 'react-dev-utils/ForkTsCheckerWebpackPlugin' {
  import { PathLike } from 'fs';
  import webpack = require('webpack');
  export interface ModuleOptions {
    typescript?: any;
    async?: boolean;
    useTypescriptIncrementalApi?: boolean;
    checkSyntacticErrors?: boolean;
    silent?: boolean;
    resolveModuleNameModule?: string;
    resolveTypeReferenceDirectiveModule?: string;
    tsconfig?: PathLike;
    reportFiles?: string[];
    watch?: PathLike;
    formatter?: any;
  }

  export default class ForkTsCheckerWebpackPlugin extends webpack.Plugin {
    constructor(options: ModuleOptions);
  }
}

declare module 'react-dev-utils/typescriptFormatter' {
  export default function _default(): any;
}

declare module 'react-dev-utils/browsersHelper' {
  import fs from 'fs';
  function checkBrowsers(appPath: fs.PathLike, isInteractive: boolean): any;
}
declare module 'react-dev-utils/evalSourceMapMiddleware' {
  import WebpackDevServer from 'webpack-dev-server';
  export default function _default(server: WebpackDevServer): any;
}

declare module 'pnp-webpack-plugin' {
  function apply(resolver: any /* EnhancedResolve.Resolver */): void;
  function moduleLoader(module: NodeModule): any;
}

declare module 'postcss-normalize' {
  export default function _default(): any;
}
declare module 'eslint-webpack-plugin' {
  import {Plugin } from 'webpack';
  export default class _default extends Plugin {
    constructor(options: any);
  }
}
declare module '@pmmmwh/react-refresh-webpack-plugin' {
  import {Plugin } from 'webpack';
  export default class _default extends Plugin {
    constructor(options: any);
  }
}
declare module 'webpack-manifest-plugin' {
  import { compilation, Plugin } from 'webpack';
  export interface FileDescriptor {
      /** Only available if isChunk is true. */
      chunk?: compilation.Chunk;
      isAsset: boolean;
      isChunk: boolean;
      /** Is required to run you app. Cannot be true if isChunk is false. */
      isInitial: boolean;
      /** Is required by a module. Cannot be true if isAsset is false. */
      isModuleAsset: boolean;
      name: string | null;
      path: string;
  }
  export default class _default extends Plugin {
    constructor(options: any);
  }
}
declare module 'postcss-safe-parser' {
  export default function _default(css: any, opts: any): any;
}
