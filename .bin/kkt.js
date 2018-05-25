#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');
const Start = require('../script/start');
const Build = require('../script/build');

program
  .description('Cli tool for creating react apps.')
  .option('build', 'Builds the app for production to the dist folder.')
  .option('start', 'Runs the app in development mode.')
  .option('-h, --host <host>', 'The port and host.', '0.0.0.0:19870')
  .version(pkg.version, '-v, --version')
  .on('--help', function () {
    console.log('\n  Examples:');
    console.log();
    console.log('    $ kkt start');
    console.log('    $ kkt build');
    console.log();
  })
  .parse(process.argv);

if (program.host) {
  program.host = program.host.split(':');
  process.env.HOST = program.host[0] || '0.0.0.0';
  process.env.PORT = parseInt(program.host[1]) || 19870;
}
// console.log('process.env:', process.env)
if (program.start) {
  // console.log('program:', program);
  Start()
} else if (program.build) {
  Build()
} else {
  program.outputHelp();
}