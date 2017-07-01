import { fetchOne, insertOne, updateOne, deleteOne } from '.'
import type { MongoDBConnection } from '../../types/mongo'

const ROLE_NAME = 'storage'

/**
  @param {MongoDBConnection} db - Mongo connection context to perform DB operations.
  @returns {(options : Object) => void} - Seneca plugin defining patterns the
    Storage microservice responds to.
*/
export default function storagePatterns(db : MongoDBConnection) {
  return function(options) {
    this
    .add({ role: ROLE_NAME, cmd: 'fetchOne' }, async (msg, reply) => {
      const result = await fetchOne(db, msg.type, msg.id)
      reply(null, result.toJSON())
    })

    .add({ role: ROLE_NAME, cmd: 'insertOne' }, async (msg, reply) => {
      const result = await insertOne(db, msg.type, msg.input)
      reply(null, result.toJSON())
    })

    .add({ role: ROLE_NAME, cmd: 'updateOne' }, async (msg, reply) => {
      const result = await updateOne(db, msg.type, msg.id, msg.input)
      reply(null, result.toJSON())
    })

    .add({ role: ROLE_NAME, cmd: 'deleteOne' }, async (msg, reply) => {
      const result = await deleteOne(db, msg.type, msg.id, msg.input)
      reply(null, result.toJSON())
    })
  }
}
