#!/usr/bin/env node

import minimist from 'minimist';

const helpStr = `
  Usage: kkt [start|build|test] [--help|h]

    Displays help information.

  Options:

    --version, -v           Show version number
    --help, -h              Displays help information.
    --app-src               Specify the entry directory.
    --docs                  Static asset preview in package(Dev mode works).
    --no-open-browser       Do not open in browser.
    --no-clear-console      Do not clear the command line information.

  Example:

  $ \x1b[35mkkt\x1b[0m build
  $ \x1b[35mkkt\x1b[0m build --app-src ./website
  $ \x1b[35mkkt\x1b[0m test
  $ \x1b[35mkkt\x1b[0m test --env=jsdom
  $ \x1b[35mkkt\x1b[0m test --env=jsdom --coverage
  $ \x1b[35mkkt\x1b[0m start
  $ \x1b[35mkkt\x1b[0m start --no-open-browser
  $ \x1b[35mkkt\x1b[0m start --watch
  $ \x1b[35mkkt\x1b[0m start --no-clear-console
  $ \x1b[35mkkt\x1b[0m start --app-src ./website
  \x1b[30;1m# Static asset preview in "@uiw/doc" package.\x1b[0m
  \x1b[30;1m# Default preview:\x1b[0m \x1b[34;1mhttp://localhost:3000/_doc/\x1b[0m
  $ \x1b[35mkkt\x1b[0m start --docs @uiw/doc/web
  \x1b[30;1m# Specify a static website route\x1b[0m \x1b[34;1m"_uiw/doc"\x1b[0m
  \x1b[30;1m# Default preview:\x1b[0m \x1b[34;1mhttp://localhost:3000/_uiw/doc\x1b[0m
  $ \x1b[35mkkt\x1b[0m start --docs @uiw/doc/web:_uiw/doc
`;

function help() {
  console.log(helpStr);
}

(async () => {
  try {
    const args = process.argv.slice(2);
    const argvs = minimist(args);
    if (argvs.h || argvs.help) {
      return help();
    }
    if (argvs.v || argvs.version) {
      const { version } = require('../../package.json');
      console.log(`\n create-kkt v${version || ''}\n`);
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
      console.log(`Unknown script "\x1b[1;37m${scriptName}\x1b[0m".`);
      console.log('Perhaps you need to update react-scripts?');
      console.log(
        'See: https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#updating-to-new-releases',
      );
      help();
    }
  } catch (error) {
    console.log('\x1b[31m KKT:ERROR:\x1b[0m', error);
  }
})();
