import seneca from 'seneca'
import { setupStorage, fetchOne, insertOne } from './storage'
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
    const result = await fetchOne(msg.type, msg.predicate)
    reply(null, result.toJSON())
  })

  .add({ role: 'storage', cmd: 'insertOne' }, async (msg, reply) => {
    const result = await insertOne(msg.type, msg.item)
    reply(null, result.toJSON())
  })
}
