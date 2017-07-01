// @flow
import { MongoClient } from 'mongodb'
import R from 'ramda'
import { _try } from '../../util'
import shortid from 'shortid'
import type { MongoDBConnection } from '../../types/mongo'

//** URL where Mongo server is listening
const url = 'mongodb://localhost:27017/bnb-book'

/**
  Variable that holds the connection to Database.
*/
let db

/**
  Async function connects to Mongo instance and creates connection pool.
  @returns {Folktale.Result}  - Object wrapping DB context object on connection,
    exception if connection failed.
*/
export async function connectToStorage() {
  return _try(async () => {
    return await MongoClient.connect(url)
  })
}


/**
  Method inserts objects into datastore.
  @param {string} collection - Name of the type (or table) to be inserted.  An id
    is generated via the shortid library, so as not to rely on mongo's _id property.
  @param Object - Item or array of items to be inserted.
  @return {Folktale.Result} - Object wrapping inserted item on success, or error on failure.
*/
export async function insertOne(db : MongoDBConnection, collection : string, item : Object) {
  return _try(async () => {
    const itemWithId = R.assoc('id', shortid.generate(), item)
    const result = await db.collection(collection).insert(itemWithId)
    return result.ops[0]
  })
}


/**
  Method retreives objects from datastore.
  @param {string} collection - Name of the type (or table) to be queried.
  @param {string} id - Id of object to be fetched.
  @return {Folktaile.Result} - Object wrapping fetched item on success, or error on failure.
*/
export async function fetchOne(db : MongoDBConnection, collection : string, id : string) : Object {
  return _try(async () => {
    return await db.collection(collection).findOne({ id })
  })
}


/**
  Method updates objects in datastore.
  @param {string} collection - Name of the type (or table) to be updated.
  @param {Object} id - Id of object to be updated.
  @param {Object} updates - An object containing keys/values representing the update.
  @return {Folktale.Result} - Object wrapping updated item on success, or error on failure.
*/
export async function updateOne(db : MongoDBConnection, collection : string, id : string, input : Object) : Object {
  return _try(async () => {
    let result = await db.collection(collection).findOneAndUpdate({ id }, { $set: input }, { returnOriginal: false })
    return result.value
  })
}


/**
  Method deletes objects from datastore.
  @param {string} collection - Name of the type (or table) to be removed.
  @param {string} id - Id of object to be removed.
  @return {Folktale.Result} - Object wrapping deleted item on success, or error on failure.
*/
export async function deleteOne(db : MongoDBConnection, collection : string, id : String) : Object {
  return _try(async () => {
    let result = await db.collection(collection).findOneAndDelete({ id })
    return result.value
  })
}
