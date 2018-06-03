const FS = require('fs');
const ghpages = require('gh-pages');
const loading = require('loading-cli');
const paths = require('../conf/path');
require('colors-cli/toxic');

const log = console.log; // eslint-disable-line

module.exports = function server(cmd) {
  const dir = paths.resolveApp(cmd.dir);
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

