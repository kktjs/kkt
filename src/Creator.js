const execa = require('execa');
const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const { copyTemplate } = require('./util/copyTemplate');
const kktpkg = require('../package.json');
const { installDeps } = require('./util/installDeps');
const { logSpinner, stopSpinner } = require('./util/spinner');
const chalk = require('colors-cli/safe');
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
          { name: ' react/react-dom + router + redux', value: 'router-redux-rematch' },
          { name: ' Cancel', value: false },
        ],
      },
    ]);
    let tempDir = null;

    if (!action) {
      return null;
    }
    tempDir = path.resolve(path.join(__dirname, '..', 'templates', action));

    // 创建目录
    await fs.ensureDir(targetDir);
    // 初始化之前初始化Git
    const shouldInitGit = await this.shouldInitGit(cliOptions);
    if (shouldInitGit) {
      logSpinner(' Initializing git repository...');
      await this.run('git init');
    }
    stopSpinner();
    // commit initial state
    let gitCommitFailed = false;
    if (tempDir) {
      const copyTemp = await copyTemplate(tempDir, targetDir, { name, KKT_VERSION });
      if (copyTemp && copyTemp.length > 0) {
        copyTemp.sort().forEach((createdFile) => {
          log(`   ${'create'.green} ${createdFile.replace(targetDir, `${name}`)}`);
        });
        log('\n⚙  Installing dependencies. This might take a while...\n');
        await installDeps(targetDir, 'npm', cliOptions.registry);
        log(`\n🎉 ${'✔'.green} Successfully created project ${name.yellow}.`);
        log(
          '👉 Get started with the following commands:\n\n' +
          `${targetDir === process.cwd() ? '' : chalk.cyan(`   ${chalk.white('$')} cd ${name}\n`)}` +
          `   ${chalk.cyan(`${chalk.white('$')} npm run start\n\n`)}`
        );
        // 提交第一次记录
        if (shouldInitGit) {
          await this.run('pwd');
          await this.run('git add -A');
          const msg = typeof cliOptions.git === 'string' ? cliOptions.git : 'Initial commit';
          try {
            await this.run('git', ['commit', '-m', msg]);
          } catch (e) {
            gitCommitFailed = true;
          }
        }
      } else {
        return log(`  Copy Tamplate Error: ${copyTemp} !!!`.red);
      }
    }

    if (gitCommitFailed) {
      log(
        'Skipped git commit due to missing username and email in git config.\n'.red +
        'You will need to perform the initial commit yourself.\n'.red
      );
    }
  }

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
