// @flow
import 'regenerator-runtime/runtime'
import Seneca from 'seneca'
import SenecaWeb from 'seneca-web'
import Express from 'express'
import SenecaWebExpress from 'seneca-web-adapter-express'
import BodyParser from 'body-parser'
import gateway from './gateway-patterns'

const Router = Express.Router
const context = new Router()
const senecaWebConfig = {
  context: context,
  adapter: SenecaWebExpress,
  options: { parseBody: false } // so we can use body-parser
}

const app = Express()
  .use(BodyParser.json())
  .use(context)
  .listen(3001)

Seneca()
  .use(SenecaWeb, senecaWebConfig)
  .use(gateway)
  .client({ type:'tcp', pin: 'role:gateway' })
