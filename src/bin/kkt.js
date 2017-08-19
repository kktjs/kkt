#!/usr/bin/env node

import * as color from 'colors-cli/toxic'
import cli from '../cli'

import {ConfigValidationError, KarmaExitCodeError, UserError} from '../errors'

function handleError(error){
  if (error instanceof UserError) {
    console.error(error.message.red)
  }else if (error instanceof ConfigValidationError) {
    error.report.log()
  }else if (error instanceof KarmaExitCodeError) {
    console.error(`Karma exit code was ${error.exitCode}`.red)
  }else {
    console.error(`Error running command: ${error.message}`.red)
    if (error.stack) {
      console.error(error.stack)
    }
  }
  process.exit(1)
}

try {
  cli(process.argv.slice(2), err => {
    if (err) handleError(err)
    process.exit(0)
  })
}
catch (e) {
  handleError(e)
}