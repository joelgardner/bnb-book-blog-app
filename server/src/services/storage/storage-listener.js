import seneca from 'seneca'
import { setupStorage, fetchOne, insertOne, updateOne, deleteOne } from './storage'
import Result from 'folktale/result'
import { iife } from '../../util'

iife(async () => {
  await setupStorage()

  seneca()
    .use(storageService)
    .listen()
})

function storageService(options) {
  this
  .add({ role: 'storage', cmd: 'fetchOne' }, async (msg, reply) => {
    const result = await fetchOne(msg.type, msg.id)
    reply(null, result.toJSON())
  })

  .add({ role: 'storage', cmd: 'insertOne' }, async (msg, reply) => {
    const result = await insertOne(msg.type, msg.input)
    reply(null, result.toJSON())
  })

  .add({ role: 'storage', cmd: 'updateOne' }, async (msg, reply) => {
    const result = await updateOne(msg.type, msg.id, msg.input)
    reply(null, result.toJSON())
  })

  .add({ role: 'storage', cmd: 'deleteOne' }, async (msg, reply) => {
    const result = await deleteOne(msg.type, msg.id, msg.input)
    reply(null, result.toJSON())
  })
}
