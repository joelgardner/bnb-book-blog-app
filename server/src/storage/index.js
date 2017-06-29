// @flow
import { MongoClient } from 'mongodb'

//** URL where Mongo server is listening
const url = 'mongodb://localhost:27017/bnb-book'

/**
  Private variable that holds the connection to Database.
*/
let db

/**
  Async function connects to Mongo instance and creates connection pool.
  @returns {Object|false} DB context object if connection succeeded, false if connection failed.
*/
export async function setupStorage() : Object|bool {
  try {
    db = await MongoClient.connect(url)
    return db
  }
  catch(e : Error) {
    console.log('Error establishing connection to Mongo:', e)
    return false
  }
}


/**
  Method inserts objects into datastore.
  @param {string} catalog - Name of the type (or table) to be inserted.
  @param Object|Array<Object> - Item or array of items to be inserted.
    If a single item is passed, it will be wrapped in an array.
  @return {Object|false} - Object describing the result of the operation, or false if the operation failed.
*/
export async function insert(catalog, items) : Object {
  try {
    return await db.collection(catalog).insertMany(Array.isArray(items) ? items : [items])
  }
  catch(e : Error) {
    console.log(`Error inserting into Mongo catalog ${catalog}:`, e.stack)
    return false
  }
}


/**
  Method retreives objects from datastore.
  @param {string} catalog - Name of the type (or table) to be queried.
  @param {Object} predicate - Object whose key-value pairs represent the where-clause.
  @return {Array<mixed>} - Results of the query.
*/
export async function select(catalog, predicate) : Object {
  try {
    return await db.collection(catalog).find(predicate).toArray()
  }
  catch(e : Error) {
    console.log(`Error querying catalog ${catalog}:`, e)
    return e
  }
}


/**
  Method updates objects in datastore.
  @param {string} catalog - Name of the type (or table) to be updated.
  @param {Object} predicate - Object whose key-value pairs represent the where-clause.
  @param {Object} updates - Object whose key-value pairs represent the updates.
  @return {Array<mixed>} - Results of the query.
*/
export async function update(catalog, predicate, updates) : Object {
  try {
    return await db.collection(catalog).update(predicate, { $set: updates })
  }
  catch(e : Error) {
    console.log(`Error updating in catalog ${catalog}:`, e)
    return e
  }
}


/**
  Method deletes objects from datastore.
  @param {string} catalog - Name of the type (or table) to be queried.
  @param Object - Object whose key-value pairs represent the where-clause.
  @return {Object} - Results of the deletion.
*/
export async function remove(catalog, predicate) : Object {
  try {
    return await db.collection(catalog).deleteMany(predicate)
  }
  catch(e : Error) {
    console.log(`Error deleting from catalog ${catalog}:`, e)
    return e
  }
}
