import webConfig from '../web'
import {build} from '../appCommands'

export default function buildWebApp(args: Object, cb) {
  build(args, webConfig(args), cb)
}
