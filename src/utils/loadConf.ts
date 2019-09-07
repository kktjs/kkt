import fs from 'fs-extra';
import path from 'path';
import * as babel from "@babel/core";
import color from 'colors-cli/safe';

export default async function(rcPath: string): Promise<any> {
  let kktrc = () => {};
  try {
    const exists = fs.existsSync(rcPath);
    if (exists) {
      const { code } = babel.transformFileSync(rcPath, {
        presets: [
          [require.resolve('@tsbb/babel-preset-tsbb'), {
            targets: false,
          }]
        ]
      });
      const kktrcPath = path.resolve(process.cwd(), 'node_modules/.cache/kkt/.kktrc.js');
      await fs.ensureDir(path.dirname(kktrcPath));
      await fs.outputFile(kktrcPath, code);
      const confFun = require(kktrcPath);
      kktrc = confFun;
    }
  } catch (error) {
    console.log(color.red('Invalid .kktrc.js file.'), error);
  }
  return kktrc;
}