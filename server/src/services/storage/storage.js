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
  @return {Either<Error, Object>} - The inserted object -- with new id -- or null if the operation failed.
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
  @param {Object} predicate - Object whose key-value pairs represent the where-clause.
  @return {Array<mixed>} - Results of the query.
*/
export async function fetchOne(collection : string, predicate : Object) : Object {
  return _try(async () => {
    return await db.collection(collection).findOne(predicate)
  })
}


/**
  Method updates objects in datastore.
  @param {string} collection - Name of the type (or table) to be updated.
  @param {Object} predicate - Object whose key-value pairs represent the where-clause.
  @param {Object} updates - Object whose key-value pairs represent the updates.
  @return {Array<mixed>} - Results of the query.
*/
export async function update(collection : string, predicate : Object, updates : Object) : Object {
  try {
    return await db.collection(collection).update(predicate, { $set: updates })
  }
  catch(e) {
    console.log(`Error updating in collection ${collection}:`, e)
    return e
  }
}


/**
  Method deletes objects from datastore.
  @param {string} collection - Name of the type (or table) to be queried.
  @param Object - Object whose key-value pairs represent the where-clause.
  @return {Object} - Results of the deletion.
*/
export async function remove(collection : string, predicate : Object) : Object {
  try {
    return await db.collection(collection).deleteMany(predicate)
  }
  catch(e) {
    console.log(`Error deleting from collection ${collection}:`, e)
    return e
  }
}

/**
  if predicate has "id" property, we must copy the string value
  (a) set predicate._id to new ObjectID(predicate.id)
  (b) remove "id"
  TODO: add "id" as a real column, and do not deal
  with "_id" which is internal to Mongo
*/
const formatIdForMongo = predicate => {
  if (!R.has('id', predicate)) return predicate
  const result = Object.assign({}, predicate, { _id: new ObjectID(predicate.id) })
  delete result.id
  return result
  // R.ifElse(
  //   R.has('id'),
  //   R.pipe(
  //     R.over(
  //       R.lens(R.prop('id'), R.assoc('_id')),
  //       R.construct(ObjectID)
  //     ),
  //     R.dissoc('id')
  //   ),
  //   R.identity
  // )(predicate)
}
