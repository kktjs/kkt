const execa = require('execa');
const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const copyTemplate = require('copy-template-dir');
const kktpkg = require('../package.json');
const { installDeps } = require('./util/installDeps');
const { logSpinner, stopSpinner } = require('./util/spinner');
const chalk = require('colors-cli');
require('colors-cli/toxic');

const log = console.log; // eslint-disable-line

// 最后一个版本号替换成 x , 当发生变化最后一个版本安装最新版本
const KKT_VERSION = kktpkg.version.split('.').slice(0, 2).concat('x').join('.');

module.exports = class Creator {
  constructor(name, targetDir) {
    this.name = name;
    this.targetDir = targetDir; // 目标文件夹
  }
  async create(cliOptions = {}) {
    const { name, targetDir } = this;
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: ` Create a template to the target directory ${targetDir.cyan} !\n   Pick an action:`,
        choices: [
          { name: ' react + react-dom', value: 'default' },
          { name: ' Cancel', value: false },
        ],
      },
    ]);
    let tempDir = null;

    if (!action) {
      return null;
    } else if (action === 'default') {
      tempDir = path.resolve(path.join(__dirname, '..', 'templates', action));
    }

    // 创建目录
    await fs.ensureDir(targetDir);
    // 初始化之前初始化Git
    const shouldInitGit = await this.shouldInitGit(cliOptions);
    if (shouldInitGit) {
      logSpinner(' Initializing git repository...');
      await this.run('git init');
    }
    stopSpinner();

    if (tempDir) {
      await copyTemplate(tempDir, targetDir, {
        name,
        kktVersion: KKT_VERSION,
      }, async (err, createdFiles) => {
        if (err) return log(`  Copy Tamplate Error: ${err} !!!`.red);
        log('');
        createdFiles.sort().forEach((createdFile) => {
          log(`   ${'create'.green} ${createdFile.replace(targetDir, `${name}`)}`);
        });
        log('\n⚙  Installing dependencies. This might take a while...\n');
        await installDeps(targetDir, 'npm', cliOptions.registry);
        log(`\n${'✔'.green} 🎉  Successfully created project ${name.yellow}.`);
        log(
          '👉 Get started with the following commands:\n\n' +
          `${targetDir === process.cwd() ? '' : chalk.cyan(`   ${chalk.white('$')} cd ${name}\n`)}` +
          `   ${chalk.cyan(`${chalk.white('$')} npm run start\n\n`)}`
        );
      });
    }
  }


  // (this.context === process.cwd() ? `` : chalk.cyan(` ${chalk.gray('$')} cd ${name}\n`)) +
  // chalk.cyan(` ${chalk.gray('$')} 'npm run start'`)

  async copyTemplateCallback(err, createdFiles) {
    if (err) return log(`Copy Tamplate Error: ${err} !!!`.red);
    createdFiles.sort().forEach((createdFile) => {
      log(`  ${'create'.green} ${createdFile}`);
    });
  }
  run(command, args) {
    if (!args) { [command, ...args] = command.split(/\s+/); }
    return execa(command, args, { cwd: this.targetDir });
  }
  async shouldInitGit(cliOptions) {
    if (cliOptions.git) {
      return cliOptions.git !== 'false';
    }
    // 检查我们是否已经在 git 仓库中
    try {
      await this.run('git', ['status']);
    } catch (e) {
      // 如果git状态失败，让我们创建一个新的 repo 返回 true
      return true;
    }
    // 如果git状态起作用，这意味着我们已经在 git 仓库中了
    // 所以不要再次初始化。
    return false;
  }
};
