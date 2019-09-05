#!/usr/bin/env node
import color from 'colors-cli';
import yargs from 'yargs';

const command = yargs
  .usage('Usage: $0 [options]')
  // .command(require('./create'))
  .command(require('./build'))
  .command(require('./start'))
  .command(require('./test'))
  .example(`$ ${color.green('kkt watch')}`, 'Rebuilds on any change.')
  .example(`$ ${color.green('kkt test')}`, 'Run test suites related.')
  .help()
  .locale('en')
  .epilog('Copyright 2019 \n')
  .argv;

if (command._.length === 0) {
  yargs.help().showHelp();
}
