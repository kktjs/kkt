#!/usr/bin/env node

import minimist from 'minimist';

function help() {
  console.log('\n  Usage: kkt [start|build|test] [--help|h]')
  console.log('\n  Displays help information.')
  console.log('\n  Options:')
  console.log('\n  Example:')
  console.log('\n');
  console.log('\n  $ kkt build')
  console.log('\n  $ kkt build --app-src ./website')
  console.log('\n  $ kkt start')
  console.log('\n  $ kkt start --no-open-browser')
  console.log('\n  $ kkt start --app-src ./website')
  console.log('\n  $ kkt test')
}

;(async () => {
  const args = process.argv.slice(2);
  const argvs = minimist(args);
  if (argvs.h || argvs.help) {
    return help();
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
      'See: https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#updating-to-new-releases'
    );
    help();
  }

})();
