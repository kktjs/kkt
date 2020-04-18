import fs from 'fs-extra';
import path from 'path';
import * as babel from "@babel/core";
import color from 'colors-cli/safe';
import { KKTRC } from '../type/kktrc';

const tsOptions = {
  compilerOptions: {
    target: 'es6',
    module: 'commonjs',
    lib: ['dom', 'es2016', 'es2017'],
    strictPropertyInitialization: false,
    noUnusedLocals: false,
    moduleResolution: 'node',
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
    experimentalDecorators: true,
    emitDecoratorMetadata: true
  }
}

export default async function(rcPath: string): Promise<KKTRC> {
  let kktrc: any = () => {};
  try {
    let exists = fs.existsSync(rcPath);
    // Support TS conf file.
    if(!exists) {
      rcPath = rcPath.replace(/\.js$/, '.ts');
      exists = fs.existsSync(rcPath);
    }
    if (exists) {
      if (/\.ts$/.test(rcPath)) {
        require('ts-node').register(tsOptions);
        kktrc = await import(rcPath);
        return kktrc;
      }
      const { code } = babel.transformFileSync(rcPath, {
        presets: [
          [require.resolve('@tsbb/babel-preset-tsbb'), {
            targets: false,
            presetReact: true,
          }],
        ],
      });
      const kktrcPath = path.resolve(process.cwd(), 'node_modules/.cache/kkt/.kktrc.js');
      await fs.ensureDir(path.dirname(kktrcPath));
      await fs.outputFile(kktrcPath, code);
      await import(kktrcPath);
      const confFun: KKTRC = await import(kktrcPath);
      kktrc = confFun;
    }
  } catch (error) {
    console.log(color.red('Invalid .kktrc.js file.\n'), error);
    new Error('Invalid .kktrc.js file.');
    process.exit(1);
  }
  return kktrc;
}