// @flow
import { MongoClient, ObjectID } from 'mongodb'

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
export async function insert(collection : string, item : Object) : any {
  try {
    const result = await db.collection(collection).insert(item)
    return Object.assign(item, { id: result.insertedIds[0] })
  }
  catch(e) {
    console.log(`Error inserting into Mongo collection ${collection}:`, e.stack)
    throw e
  }
}


/**
  Method retreives objects from datastore.
  @param {string} collection - Name of the type (or table) to be queried.
  @param {Object} predicate - Object whose key-value pairs represent the where-clause.
  @return {Array<mixed>} - Results of the query.
*/
export async function select(collection : string, predicate : Object) : Object {
  try {
    if (predicate._id) {
      predicate._id = new ObjectID(predicate._id)
    }
    return await db.collection(collection).find(predicate).toArray()
  }
  catch(e) {
    console.log(`Error querying collection ${collection}:`, e)
    return e
  }
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
