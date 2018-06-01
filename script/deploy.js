const FS = require('fs');
const PATH = require('path');
const ghpages = require('gh-pages');
const loading = require('loading-cli');
require('colors-cli/toxic');

const log = console.log; // eslint-disable-line

const appDirectory = FS.realpathSync(process.cwd());
// const toolDirectory = FS.realpathSync(__dirname);
// Markdown 所在目录
const resolveApp = relativePath => PATH.resolve(appDirectory, relativePath);

module.exports = function server(cmd) {
  const dir = resolveApp(cmd.dir);
  if (!FS.existsSync(dir)) {
    log(`You need to run the ${`\"npm run build\"`.yellow} command.`); // eslint-disable-line
    log(`The ${(cmd.dir).red} folder does net exist!\n`);
    return;
  }

  log('  Start public to your git repo'.green);
  log(`  Directory '${cmd.dir}' pushed to ${cmd.url} ${cmd.branch} branch\n`.green);

  const load = loading({
    text: 'Please wait ...'.blue,
    color: 'blue',
    interval: 100,
    stream: process.stdout,
  }).start();

  ghpages.publish(dir, {
    branch: cmd.branch,
    repo: cmd.url,
    message: `Update website, ${new Date()}!`,
  }, (err) => {
    load.stop();
    if (err) {
      return log(err);
    }
    log(`\n  Push to ${cmd.branch} success!\n`.green.bold);
  });
};

