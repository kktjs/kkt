#!/usr/bin/env node

const program = require('commander');
const colors = require('colors-cli/safe')
const pkg = require('../package.json');
const exampleHelp = 'Example from https://github.com/jaywcjlove/kkt/tree/master/example example-path';

const logs = console.log; // eslint-disable-line

program
  .description('Rapid React development, Cli tool for creating react apps.')
  .version(pkg.version, '-v, --version')
  .usage('<command> [options]')

program
  .command('create <app-name>')
  .description('create a new project powered by kkt')
  .option('-e, --example <example-path>', exampleHelp, 'default')
  // .option('-g, --git [message]', 'Force / skip git intialization, optionally specify initial commit message')
  .option('-r, --registry <url>', 'Use specified npm registry when installing dependencies (only for npm)')
  .option('-f, --force', 'Overwrite target directory if it exists')
  .on('--help', () => {
    logs()
    logs('  Examples:')
    logs()
    logs('    # create a new project with an official template')
    logs('    $ kkt create my-project')
    logs('    $ kkt create my-project --example rematch')
    logs('    $ kkt create my-project -e rematch')
    // logs()
    // logs('    # create a new project straight from a gitlab.net template')
    // logs('    $ kkt init username/repo my-project')
    logs()
  })
  .action((name, cmd) => {
    require('../script/create')({ projectName: name, ...cmd })
  })

program
  .command('build')
  .description('Builds the app for production to the dist folder.')
  .option('-w, --watch', 'Empty the DIST directory before compiling.')
  .option('-b, --bundle [value]', 'Bundles a minified and unminified version.')
  .option('-e, --emptyDir [value]', 'Empty the DIST directory before compiling.', true)
  .option('--no-emptyDir', 'Empty the DIST directory before compiling.')
  .action((...cmd) => {
    cmd = cmd[cmd.length - 1];
    require('../script/build')(cmd.bundle, cmd.emptyDir, cmd.watch)
  })

program
  .command('start')
  .description('Will create a web server, Runs the app in development mode.')
  .on('--help', () => {
    logs()
    logs('  Examples:')
    logs()
    logs('    $ kkt start')
    logs('    $ kkt start --host 127.0.0.0:8118')
    logs()
  })
  .action((...cmd) => {
    cmd = cmd[cmd.length - 1];
    require('../script/start')(cmd)
  })

program
  .command('watch')
  .description('Does not provide web server, Listen only for file change generation files')
  .on('--help', () => {
    logs()
    logs('  Examples:')
    logs('    https://webpack.docschina.org/configuration/watch/#watchoptions')
    logs(`    May be used for ${colors.green('Electron')} or ${colors.green('Chrome-Plugin')} project development.`)
    logs()
    logs('    $ kkt watch')
    logs()
  })
  .action((cmd) => {
    require('../script/watch')(cmd)
  })

program
  .command('test')
  .description('Runs the app in development mode.')
  .option('-e, --env', 'If you know that none of your tests depend on jsdom, you can safely set --env=node, and your tests will run faster')
  .option('-c, --coverage', 'coverage reporter that works well with ES6 and requires no configuration.')
  .on('--help', () => {
    logs();
    logs('  Examples:');
    logs();
    logs(`    $ ${colors.green('kkt test --env=jsdom')}`);
    logs(`    $ ${colors.green('kkt test --env=jsdom --coverage')}`);
    logs();
  })
  .action((env, coverage, cmd) => {
    const cmdp = cmd || coverage;
    const args = [];
    if (cmdp.env) {
      args.push(`--env=${env}`);
    }
    if (cmdp.coverage) {
      args.push('--coverage');
    } else if (!process.env.CI) {
      args.push('--watch');
    }
    require('../script/test')(args, cmdp); // eslint-disable-line
  });

program
  .command('deploy')
  .description('Push the specified directory to the gh-pages branch.')
  .option('-b, --branch [name]', 'Specify branch.', 'gh-pages')
  .option('-d, --dir [path]', 'Specify the deployment directory.', 'dist')
  .option('-u, --url <dir>', 'Specify repository URL.')
  .action((cmd) => {
    require('../script/deploy')(cmd)
  })

program
  .arguments('<command>')
  .action((cmd) => {
    program.outputHelp()
    logs(`  ` + colors.red(`Unknown command ${colors.yellow(cmd)}.`))
    logs()
  })

program.on('--help', function () {
  logs('\n  Examples:');
  logs();
  logs(`    $ ${colors.green('kkt')} start`);
  logs(`    $ ${colors.green('kkt')} build`);
  logs(`    $ ${colors.green('kkt')} watch`);
  logs(`    $ ${colors.green('kkt')} test --env=jsdom`);
  logs(`    $ ${colors.green('kkt')} test --env=jsdom --coverage`);
  logs();
  logs();
})

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
