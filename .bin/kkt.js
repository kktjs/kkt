#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');
const Start = require('../script/start');
const Build = require('../script/build');
const Deploy = require('../script/deploy');
// const paths = require('../conf/path');

program
  .version(pkg.version, '-v, --version')
  .usage('<command> [options]')

if (program.host) {
  program.host = program.host.split(':');
  process.env.HOST = program.host[0] || '0.0.0.0';
  process.env.PORT = parseInt(program.host[1]) || 19870;
}

program
  .command('create <app-name>')
  .description('create a new project powered by kkt')
  .option('-c, --clone', 'Use git clone when fetching remote preset')
  .action((name, cmd) => {
    // console.log('create:app-name');
    // require('../lib/create')(name, cleanArgs(cmd))
  })

program
  .command('build')
  .description('Builds the app for production to the dist folder.')
  .option('--host <host>', 'The port and host.', '0.0.0.0:19870')
  .action((name, cmd) => {
    Build(name, cmd);
  })

program
  .command('start')
  .description('Runs the app in development mode.')
  .option('--host <host>', 'The port and host.', '0.0.0.0:19870')
  .action((name, cmd) => {
    Start(name, cmd)
  })

program
  .command('deploy')
  .description('Runs the app in development mode.')
  .option('-b, --branch [name]', 'Specify branch.', 'gh-pages')
  .option('-d, --dir [path]', 'Specify the deployment directory.', 'dist')
  .option('-u, --url <dir>', 'Specify repository URL.')
  .action((name, cmd) => {
    Deploy(name, cmd);
  })

program.on('--help', function () {
  console.log('\n  Examples:');
  console.log();
  console.log('    $ kkt start');
  console.log('    $ kkt build');
  console.log();
})

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);
