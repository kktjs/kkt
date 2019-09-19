import fs from 'fs';
import { Config } from '@jest/types';
import color from 'colors-cli/safe';
import * as paths from './paths';

export interface JestConfOptions {
  env: string;
  rootDir: string;
}

export default (options: JestConfOptions) => {
  const overrides: Config.InitialOptions = Object.assign({}, require(paths.appPackageJson).jest);
  const supportedKeys: (keyof Config.InitialOptions)[] = [
    'collectCoverageFrom',
    'coverageReporters',
    'coverageThreshold',
    'globals',
    'mapCoverage',
    'maxWorkers',
    'moduleFileExtensions',
    'moduleNameMapper',
    'modulePaths',
    'snapshotSerializers',
    'setupFiles',
    'testMatch',
    'testEnvironmentOptions',
    'testResultsProcessor',
    'transform',
    'transformIgnorePatterns',
    'reporters',
  ];
  const conf: Config.InitialOptions = {
    /**
     * Specifies the maximum number of workers the
     * worker-pool will spawn for running tests. This
     * defaults to the number of the cores available
     * on your machine. (its usually best not to
     * override this default) [number]
     */
    maxWorkers: 1,
    "roots": [
      "<rootDir>/src"
    ],
    rootDir: options.rootDir,
    collectCoverageFrom: [
      'src/**/*.{js,jsx,ts,tsx}',
      '!src/**/*.d.ts',
    ],
    setupTestFrameworkScriptFile: fs.existsSync(paths.testsSetup)
      ? '<rootDir>/src/setupTests.js'
      : undefined,
    testMatch: [
      '<rootDir>/**/__tests__/**/*.{ts,tsx,js,jsx}',
      '<rootDir>/**/?(*.)(spec|test).{ts,tsx,js,jsx}',
    ],
    testEnvironment: options.env || 'jsdom',
    testURL: 'http://localhost',
    transform: {
      // '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
      '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/kkt/lib/config/jest/babelTransform.js',
      '^.+\\.css$': '<rootDir>/node_modules/kkt/lib/config/jest/cssTransform.js',
      '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '<rootDir>/node_modules/kkt/lib/config/jest/fileTransform.js',
    },
    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
      '^.+\\.module\\.(css|sass|scss|less)$',
    ],
    moduleNameMapper: {
      '^react-native$': 'react-native-web',
      '^.+\\.module\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    },
    moduleFileExtensions: [
      "web.js",
      "js",
      "web.ts",
      "ts",
      "web.tsx",
      "tsx",
      "json",
      "web.jsx",
      "jsx",
      "node"
    ],
    watchPlugins: [
      "jest-watch-typeahead/filename",
      "jest-watch-typeahead/testname"
    ]
  };

  if (overrides) {
    supportedKeys.forEach((key: keyof Config.InitialOptions) => {
      if (overrides.hasOwnProperty(key)) {
        (conf[key] as any) = overrides[key];
        delete overrides[key];
      }
    });
    const unsupportedKeys = Object.keys(overrides);
    if (unsupportedKeys.length) {
      console.error(
        color.red(
          'Out of the box, kkt only supports overriding ' +
          'these Jest options:\n\n' +
          supportedKeys.map(key => color.bold('  \u2022 ' + key)).join('\n') +
          '.\n\n' +
          'These options in your package.json Jest configuration ' +
          'are not currently supported by kkt:\n\n' +
          unsupportedKeys.map(key => color.bold('  \u2022 ' + key)).join('\n')
        )
      );
      process.exit(1);
    }
  }
  return conf;
}