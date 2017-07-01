// @flow
import seneca from 'seneca'
const S = seneca()
import { promisify } from 'util'
import Result from 'folktale/result'
import R from 'ramda'

const act = promisify(S.act.bind(S))

// send messages over http
S.client({ port: 10101 })

const generated = [
  'User',
  'LocalAuth',
  'Property',
  'Address',
  'Room',
  'File'
].reduce((resolvers, type) => {

  // get singular
  resolvers[`get${type}`] = async (predicate, context) =>
    matchOrThrow(Result.fromJSON(await act({
      role: 'storage',
      cmd: 'fetchOne',
      type,
      predicate
    })))


  // create singular
  resolvers[`create${type}`] = async (item, context) =>
    matchOrThrow(Result.fromJSON(await act({
      role: 'storage',
      cmd: 'insertOne',
      type,
      item
    })))


  return resolvers
}, {})

export default generated


const matchOrThrow = result => result.matchWith({
  Ok:     ({ value }) => value,
  Error:  ({ value }) => { throw new Error(value) }
})

export async function createUser(user, context) {
  return Promise.resolve({ id: 2, name: 'Billy Jean' })
}


// import { select, insert } from '../storage'

// export async function getUser({ id }, context) {
//   try {
//     const results = await select('User', { _id: id })
//     return Object.assign(results[0], { id : results[0]._id })
//   }
//   catch (e) {
//     console.log(e)
//     throw e
//   }
// }
//
// export async function createUser(user, context) {
//   try {
//     return await insert('User', user)
//   }
//   catch (e) {
//     console.log(e)
//     throw e
//   }
// }
