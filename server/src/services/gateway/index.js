// @flow
'use strict'
import 'regenerator-runtime/runtime'
import express from 'express'
import bodyParser from 'body-parser'
import { graphql, buildSchema } from 'graphql'
import fs from 'fs'
import { promisify } from 'util'
import Root from './resolvers'
import { iife } from 'bnb-book-util'

iife(async () => {
  // express setup
  const app = express()
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  // read in the schema.graphql file, and build our schema with it
  const readFile : (string, string) => Promise<string> = promisify(fs.readFile)
  const gql : string = await readFile(`${__dirname}/schema.graphql`, 'utf8')
  const schema : Object = buildSchema(gql)
  app.post('/graphql', async (req, res) => {
    const { query, args } = req.body
    const result : Object = await graphql(schema, query, Root, { user: 'Bill' }, args)
    res.send(result)
  })

  app.listen(3001, () => {
    /* eslint-disable no-console */
    console.log('Listening on port 3001.')
    /* eslint-enable no-console */
  })
})
