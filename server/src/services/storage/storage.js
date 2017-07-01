// @flow
import { MongoClient, ObjectID } from 'mongodb'
import Result from 'folktale/result'
import R from 'ramda'
import { _try } from '../../util'
import shortid from 'shortid'

//** URL where Mongo server is listening
const url = 'mongodb://localhost:27017/bnb-book'

/**
  Private variable that holds the connection to Database.
*/
let db

/**
  Async function connects to Mongo instance and creates connection pool.
  @returns {Object} DB context object if connection succeeded, logs & throws exception if connection failed.
*/
export async function setupStorage() : Object {
  try {
    db = await MongoClient.connect(url)
    return db
  }
  catch(e) {
    console.log('Error establishing connection to Mongo:', e)
    throw e
  }
}


/**
  Method inserts objects into datastore.
  @param {string} collection - Name of the type (or table) to be inserted.
  @param Object - Item or array of items to be inserted.
  @return {Folktale.Result} - Object wrapping inserted item on success, or error on failure.
*/
export async function insertOne(collection : string, item : Object) : any {
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
export async function fetchOne(collection : string, id : string) : Object {
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
export async function updateOne(collection : string, id : string, input : Object) : Object {
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
export async function deleteOne(collection : string, id : String) : Object {
  return _try(async () => {
    let result = await db.collection(collection).findOneAndDelete({ id })
    return result.value
  })
}
