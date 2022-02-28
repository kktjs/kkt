#!/usr/bin/env node

process.env.FAST_REFRESH = 'false';

import minimist from 'minimist';
import path from 'path';
import fs from 'fs-extra';
import { BuildArgs } from 'kkt';
import { overridePaths } from 'kkt/lib/overrides/paths';
import { sync as gzipSize } from 'gzip-size';
import filesize from 'filesize';
import './overrides';
import { filterPlugins, removeLoaders } from './utils';

function help() {
  const { version } = require('../package.json');
  console.log('\n  Usage: \x1b[34;1mncc\x1b[0m [build|watch] [input-file] [--help|h]');
  console.log('\n  Displays help information.');
  console.log('\n  Options:\n');
  console.log('   --version, -v        ', 'Show version number');
  console.log('   --help, -h           ', 'Displays help information.');
  console.log('   -o, --out [dir]      ', 'Output directory for build (defaults to \x1b[35mdist\x1b[0m).');
  console.log('   -m, --minify         ', 'Minify output.');
  console.log(
    '   -t, --target         ',
    'Instructs webpack to target a specific environment (defaults to \x1b[35mnode14\x1b[0m).',
  );
  console.log(
    '   -l, --library        ',
    'Output a library exposing the exports of your entry point. The parameter "--target=web" works.',
  );
  console.log('   -s, --source-map     ', 'Generate source map.');
  console.log('   -e, --external [mod] ', "Skip bundling 'mod'. Can be used many times.");
  console.log('   --filename           ', 'output file name.');
  console.log('\n  Example:\n');
  console.log('   $ \x1b[35mncc\x1b[0m build');
  console.log('   $ \x1b[35mncc\x1b[0m build --out ./dist');
  console.log('   $ \x1b[35mncc\x1b[0m build --minify');
  console.log('   $ \x1b[35mncc\x1b[0m watch --minify');
  console.log('   $ \x1b[35mncc\x1b[0m build src/app.ts');
  console.log(`   $ \x1b[35mncc\x1b[0m build --target web --library MyLibrary`);
  console.log(`   $ \x1b[35mncc\x1b[0m build --source-map`);
  console.log(`\n  \x1b[34;1m@kkt/ncc\x1b[0m \x1b[32;1mv${version || ''}\x1b[0m\n`);
}

interface NCCArgs extends BuildArgs {
  out?: string;
  target?: string;
  filename?: string;
  minify?: boolean;
  external?: string[];
  sourceMap?: boolean;
}

const data = {
  nolog: false,
  minify: false,
  filename: '',
  // .js file
  file: '',
  filePath: '',
  fileMin: '',
  fileMinPath: '',
  // .js.map file
  mapFile: '',
  mapMinFile: '',
  mapMinFilePath: '',
  mapFilePath: '',
  // .css file
  cssFile: '',
  cssFilePath: '',
  cssMinFile: '',
  cssMinFilePath: '',
};

process.on('beforeExit', () => {
  if (data.nolog) {
    return;
  }
  if (fs.existsSync(data.fileMinPath)) {
    data.fileMin = fs.readFileSync(data.fileMinPath).toString();
  }
  if (fs.existsSync(data.filePath)) {
    data.file = fs.readFileSync(data.filePath).toString();
  }
  if (fs.existsSync(data.mapMinFilePath)) {
    data.mapMinFile = fs.readFileSync(data.mapMinFilePath).toString();
  }
  if (fs.existsSync(data.mapFilePath)) {
    data.mapFile = fs.readFileSync(data.mapFilePath).toString();
  }
  if (fs.existsSync(data.cssFilePath)) {
    data.cssFile = fs.readFileSync(data.cssFilePath).toString();
  }
  if (fs.existsSync(data.cssMinFilePath)) {
    data.cssMinFile = fs.readFileSync(data.cssMinFilePath).toString();
  }
});

process.on('exit', (code) => {
  if (code === 1 || data.nolog) {
    return;
  }
  const outputDir = path.relative(process.cwd(), path.dirname(data.filePath));
  if (!!data.file) {
    fs.writeFileSync(data.filePath, data.file);
    !data.minify &&
      console.log(
        `   ${filesize(gzipSize(data.file))}  \x1b[30;1m${outputDir}/\x1b[0m\x1b[32m${data.filename}\x1b[0m.`,
      );
  }
  if (!!data.fileMin) {
    fs.writeFileSync(data.fileMinPath, data.fileMin);
    data.minify &&
      console.log(
        `   ${filesize(gzipSize(data.fileMin))}  \x1b[30;1m${outputDir}/\x1b[0m\x1b[32m${data.filename}\x1b[0m.`,
      );
  }
  if (!!data.mapMinFile) {
    fs.writeFileSync(data.mapMinFilePath, data.mapMinFile);
  }
  if (!!data.mapFile) {
    fs.writeFileSync(data.mapFilePath, data.mapFile);
  }

  if (!!data.cssFile) {
    fs.writeFileSync(data.cssFilePath, data.cssFile);
    !data.minify &&
      console.log(
        `   ${filesize(gzipSize(data.cssFile))}  \x1b[30;1m${outputDir}/\x1b[0m\x1b[32m${path.basename(
          data.cssFilePath,
        )}\x1b[0m.`,
      );
  }
  if (!!data.cssMinFile) {
    fs.writeFileSync(data.cssMinFilePath, data.cssMinFile);
    data.minify &&
      console.log(
        `   ${filesize(gzipSize(data.cssMinFile))}  \x1b[30;1m${outputDir}/\x1b[0m\x1b[32m${path.basename(
          data.cssMinFilePath,
        )}\x1b[0m.`,
      );
  }
  console.log(`\n`);
});

(async () => {
  try {
    const args = process.argv.slice(2);
    const argvs: NCCArgs = minimist(args);
    if (argvs.h || argvs.help) {
      data.nolog = true;
      return help();
    }
    if (argvs.v || argvs.version) {
      data.nolog = true;
      const { version } = require('../package.json');
      console.log(`\n \x1b[34;1m@kkt/ncc\x1b[0m \x1b[32;1mv${version || ''}\x1b[0m\n`);
      return;
    }

    argvs.out = argvs.o = path.resolve(argvs.out || argvs.o || 'dist');
    argvs.minify = argvs.m = argvs.minify || argvs.m || false;

    const scriptName = argvs._[0];
    const inputFile = path.resolve(argvs._[1] || 'src/index.ts');

    if (!fs.existsSync(inputFile)) {
      throw Error(`KKT:NCC: Example "build <input-file> [opts]".`);
    }

    const fileName = argvs.filename || path.basename(inputFile).replace(/.(js|jsx?|cjs|mjs|tsx?)$/, '');
    const outDir = argvs.out;

    data.filename = `${fileName}${argvs.minify ? '.min.js' : '.js'}`;

    data.filePath = path.resolve(argvs.out, `${fileName}.js`);
    data.fileMinPath = path.resolve(argvs.out, `${fileName}.min.js`);
    data.mapMinFilePath = path.resolve(argvs.out, `${fileName}.js.map`);
    data.mapFilePath = path.resolve(argvs.out, `${fileName}.min.js.map`);
    data.cssFilePath = path.resolve(argvs.out, `${fileName}.css`);
    data.cssMinFilePath = path.resolve(argvs.out, `${fileName}.min.css`);

    if (fs.existsSync(data.fileMinPath)) {
      data.fileMin = fs.readFileSync(data.fileMinPath).toString();
    }
    if (fs.existsSync(data.filePath)) {
      data.file = fs.readFileSync(data.filePath).toString();
    }
    if (fs.existsSync(data.mapFilePath)) {
      data.mapFile = fs.readFileSync(data.mapFilePath).toString();
    }
    if (fs.existsSync(data.mapMinFilePath)) {
      data.mapMinFile = fs.readFileSync(data.mapMinFilePath).toString();
    }
    if (fs.existsSync(data.cssFilePath)) {
      data.cssFile = fs.readFileSync(data.cssFilePath).toString();
    }
    if (fs.existsSync(data.cssMinFilePath)) {
      data.cssMinFile = fs.readFileSync(data.cssMinFilePath).toString();
    }

    const publicFolder = path.join(process.cwd(), 'node_modules', '.cache', 'kkt', '.~public');
    fs.ensureDirSync(publicFolder);

    const oPaths = { appBuild: outDir, appIndexJs: inputFile, appPublic: publicFolder };
    const isWeb = /^(web|browserslist)$/.test(argvs.target);
    const target = isWeb ? argvs.target : argvs.target ? ['node14', argvs.target] : 'node14';
    fs.ensureDirSync(outDir);
    overridePaths(undefined, { ...oPaths });
    argvs.overridesWebpack = (conf, env, options) => {
      overridePaths(undefined, { ...oPaths });
      conf = filterPlugins(conf, argvs.minify, isWeb ? fileName : null);
      if (isWeb) {
        conf = removeLoaders(conf);
      }
      conf.entry = inputFile;
      if (argvs.sourceMap) {
        conf.devtool = typeof argvs.sourceMap === 'boolean' ? 'source-map' : argvs.sourceMap;
      } else {
        conf.devtool = false;
      }
      conf.module!.exprContextCritical = false;
      conf.amd = false;
      conf.target = target;
      conf.mode = scriptName === 'watch' ? 'development' : 'production';
      conf.output = {};
      if (argvs.external) conf.externals = argvs.external;
      conf.output.libraryTarget = 'commonjs';
      conf.output.path = outDir;
      conf.output.filename = data.filename;
      if (isWeb) {
        conf.output.libraryTarget = 'umd';
        if (argvs.library) {
          conf.output.library = argvs.library;
        }
      }
      return conf;
    };
    data.minify = argvs.minify;
    if (scriptName === 'build') {
      await (
        await import('kkt/lib/scripts/build')
      ).default({
        ...argvs,
        bundle: true,
        isNotCheckHTML: true,
        overridePaths: { ...oPaths },
      });
    } else if (scriptName === 'watch') {
      await (
        await import('kkt/lib/scripts/start')
      ).default({
        ...argvs,
        watch: true,
        bundle: true,
        isNotCheckHTML: true,
        overridePaths: { ...oPaths },
      });
    }
  } catch (error) {
    console.log('\x1b[31m KKT:NCC:ERROR:\x1b[0m', error);
  }
})();
