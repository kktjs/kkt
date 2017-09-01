// @flow
import webConfig from '../web'
import {serve} from '../appCommands'

import type {ErrBack} from '../types'

// 提供一个简单的JS应用程序server
export default function serveWebApp(args: Object, cb: ErrBack) {
  serve(args, webConfig(args), cb)
}
