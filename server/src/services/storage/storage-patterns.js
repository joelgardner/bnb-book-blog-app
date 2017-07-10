// @flow
'use strict'
import { fetchOne, insertOne, updateOne, deleteOne } from './index'
import type { MongoDBConnection } from '../../types/mongo'

const ROLE_NAME = 'storage'

/**
  Seneca plugin defining patterns the Storage microservice responds to.
*/
export default function storage(options) {
  this
  .add({ role: ROLE_NAME, cmd: 'fetchOne' }, async (msg, reply) => {
    const result = await fetchOne(msg.type, msg.id)
    reply(result.toJSON())
  })

  .add({ role: ROLE_NAME, cmd: 'insertOne' }, async (msg, reply) => {
    const result = await insertOne(msg.type, msg.input)
    reply(result.toJSON())
  })

  .add({ role: ROLE_NAME, cmd: 'updateOne' }, async (msg, reply) => {
    const result = await updateOne(msg.type, msg.id, msg.input)
    reply(result.toJSON())
  })

  .add({ role: ROLE_NAME, cmd: 'deleteOne' }, async (msg, reply) => {
    const result = await deleteOne(msg.type, msg.id, msg.input)
    reply(result.toJSON())
  })
}
