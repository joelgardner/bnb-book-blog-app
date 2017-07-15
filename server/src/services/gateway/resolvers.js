// @flow
import seneca from 'seneca'
const S = seneca()
import { promisify } from 'util'
import Result from 'folktale/result'
import R from 'ramda'

const act = promisify(S.act.bind(S))

// send messages over http
S.client({ port: 10101 })

/**
  List of types (see schema.graphql).  Each one is used to generate:
  - fetchX: a resolver that returns the first item matching the predicate.
  - createX: a resolver that creates an item in the database.
  - updateX: a resolver that updates the first item matching the predicate.
  - deleteX: a resolver that deletes the first item matching the predicate.
  Each auto-generated resolver only acts upon one item: the first one found
  that matches the predicate.  It is up to the user to define and implement
  other, more specific resolvers (getUsersByProperty, getFilesByRoom, etc.)
*/
const types = [
  'User',
  'LocalAuth',
  'Property',
  'Address',
  'Room',
  'File'
]

const generated = types.reduce((resolvers, type) => {

  // get
  resolvers[`fetch${type}`] = ({ id }, context) =>
    resolver({ role: 'storage', cmd: 'fetchOne', type, id })

  // create
  resolvers[`create${type}`] = ({ input }, context) =>
    resolver({ role: 'storage', cmd: 'insertOne', type, input })

  // update
  resolvers[`update${type}`] = ({ id, input }, context) =>
    resolver({ role: 'storage', cmd: 'updateOne', type, id, input })

  // delete
  resolvers[`delete${type}`] = ({ id }, context) =>
    resolver({ role: 'storage', cmd: 'deleteOne', type, id })

  return resolvers
}, {})

const custom = {
  createBooking: async (args, context) => {
    return await Promise.resolve({
      id: "asdf",
      email: "asdf@asdf.com",
      room: {
        id: 123
      },
      start: new Date().getTime(),
      end: new Date().getTime()
    })
  },
  listProperties: async (args, context) => {
    return await Promise.resolve([{
      id: "asdf",
      street1: "street1!",
      street2: "street2!",
      city: "derpville",
      state: "tx"
    }])
  }
}

/*
curl -X POST localhost:3000/graphql -H "content-type: application/json" -d '{ "query": "mutation CreateBooking($roomId: ID!, $email: String!, $start: Date!, $end: Date!) { createBooking(roomId: $roomId, email: $email, start: $start, end: $end) { id email start end room { id } } }", "args": { "roomId": "123", "email": "asdf@asdf.com", "start": "1499962535630", "end": "1499962537859" } }'
*/
export default R.merge(generated, custom)

/**
  Builds an async resolver.
  @param {Object} pin - Seneca pin representing the message to send out.
  @returns {any} Result from the Seneca service, or throws an error if the call failed.
*/
const resolver = async pin =>
  Result.fromJSON(await act(pin)).matchWith({
    Ok:     ({ value }) => value,
    Error:  ({ value }) => { throw new Error(value) }
  })
