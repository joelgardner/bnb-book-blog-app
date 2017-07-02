// @flow
import seneca from 'seneca'
import { connectToStorage } from '.'
import { iife } from '../../util'
import storage from './storage-patterns'
import type { MongoDBConnection } from '../../types/mongo'

/**
  Use an IIFE to initialize a connection to the Mongo store.
  - If successful, start a Seneca microservice listening for patterns defined
      storage-patterns.js.
  - If unsuccessful, end the process, logging the exception.
*/
iife(async () => {
  // connect to Mongo instance
  const connection = await connectToStorage()

  // success
  connection.map(db => {
    seneca()
      .use(storage)
      .listen()
  })

  // failure
  .orElse(e => {
    console.log('Connection to Mongo instance failed:', e)
  })
})
