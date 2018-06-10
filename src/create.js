const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const Creator = require('./Creator');
const { logSpinner, stopSpinner } = require('./util/spinner');

async function create(projectName, options) {
  const inCurrent = projectName === '.';
  const name = inCurrent ? path.relative('../', process.cwd()) : projectName;
  const targetDir = path.resolve(projectName || '.');

  if (fs.existsSync(targetDir)) {
    if (options.force) {
      logSpinner(` Emptying target directory ${targetDir.yellow}`);
      await fs.remove(targetDir);
      stopSpinner();
    } else if (inCurrent) {
      const { ok } = await inquirer.prompt([{
        name: 'ok',
        type: 'confirm',
        message: 'Generate project in current directory?',
      }]);
      if (!ok) return null;
    } else {
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: ` Target directory ${targetDir} already exists. Pick an action:`,
          choices: [
            { name: ' Overwrite', value: 'overwrite' },
            { name: ' Cancel', value: false },
          ],
        },
      ]);
      if (!action) {
        return null;
      } else if (action === 'overwrite') {
        logSpinner(` Emptying target directory ${targetDir.yellow}`);
        await fs.remove(targetDir);
        stopSpinner();
      }
    }
  }
  const creator = new Creator(name, targetDir);
  await creator.create(options);
}

module.exports = (...args) => {
  create(...args).catch(() => {
    // console.log('err', err);
  });
};
