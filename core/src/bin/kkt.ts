#!/usr/bin/env node

import minimist from 'minimist';

function help() {
  console.log('\n  Usage: kkt [start|build|test] [--help|h]');
  console.log('\n  Displays help information.');
  console.log('\n  Options:\n');
  console.log('    --version, -v', 'Show version number');
  console.log('    --help, -h', 'Displays help information.');
  console.log('\n  Example:');
  console.log('\n');
  console.log('  $ \x1b[35mkkt\x1b[0m build');
  console.log('  $ \x1b[35mkkt\x1b[0m build --app-src ./website');
  console.log('  $ \x1b[35mkkt\x1b[0m start');
  console.log('  $ \x1b[35mkkt\x1b[0m start --no-open-browser');
  console.log('  $ \x1b[35mkkt\x1b[0m start --app-src ./website');
  console.log('  $ \x1b[35mkkt\x1b[0m test');
}

(async () => {
  const args = process.argv.slice(2);
  const argvs = minimist(args);
  if (argvs.h || argvs.help) {
    return help();
  }
  const { version } = require('../../package.json');
  if (argvs.v || argvs.version) {
    console.log(`\n create-kkt v${version}\n`);
    return;
  }
  const scriptName = argvs._[0];
  if (scriptName && /(^build|start|test)$/.test(scriptName)) {
    if (scriptName === 'test') {
      await require('../scripts/testk')(argvs);
    } else {
      await require(`../scripts/${scriptName}`)(argvs);
    }
  } else {
    console.log(`Unknown script "${scriptName}".`);
    console.log('Perhaps you need to update react-scripts?');
    console.log(
      'See: https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#updating-to-new-releases',
    );
    help();
  }
})();
