// @flow
import { graphql, buildSchema } from 'graphql'
import fs from 'fs'
import { promisify } from 'util'
import Root from './resolvers'

/**
  Seneca plugin for our API gateway
*/
export default async function gateway(options) {

  this.add({ role: 'gateway', path: 'graphql' }, async (msg, reply) => {
    const { query, args } = msg.args.body
    const result : Object = await graphql(schema, query, Root, { user: 'Bill' }, args)
    reply(result)
  })

  /**
    Initialize the Seneca Web Plugin, which is using Express to receive API
    requests and forward them onto the action handlers defined via .add() above.
  */
  this.add('init:gateway', (msg, reply) => {
    this.act('role:web', {
      routes: {
        //prefix: 'v0',
        pin: 'role:gateway, path:*',
        map: {
          graphql: {
            POST: true
          }
        }
      }
    }, reply)
  })

  // read in the schema.graphql file, and build our schema with it
  const readFile : (string, string) => Promise<string> = promisify(fs.readFile)
  const gql : string = await readFile(`${__dirname}/schema.graphql`, 'utf8')
  const schema : Object = buildSchema(gql)
}
