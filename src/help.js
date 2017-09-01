import * as color from 'colors-cli/toxic'
import pkg from '../package.json'

export var news = `
    ${'kkt new'.green} ${'<project_type> <dir_name>'.yellow} ${'[options]'.x51}
`
export var newsError = `
    ${"ERROR:".red} ${'kkt new'.green} ${'<project_type> <dir_name>'.yellow} ${'[options]'.x51}
`

export var projectTypes = `
    ${'web-app'.yellow}          a plain JavaScript app
`

export var options = `
    ${'-h, --help'.x51}     display this help message
    ${'-v, --version'.x51}  print kkt's version
`

export var help = `
  Usage: ${'kkt'.green} ${'<command>'.yellow} ${'[options]'.x51}

  Options: ${options}
  Project types: ${projectTypes}
  Project creation commands: ${news}

  Project type-specific commands:
    ${'kkt build-web-app'.green} ${'[entry] [dist-dir]'.x51}
    ${'->'.green} Build a web app from ${'entry'.x51} to ${'dist-dir'.x51}.

`
export var version = `
  kkt v${pkg.version.green}
`