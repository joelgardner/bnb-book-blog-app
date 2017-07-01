// @flow
export type MongoDBConnection = {
  collection: (collectionName : string) => MongoCollection
}

export type MongoCollection = {
  insert: (item : any) => Promise<any>,
  findOne: (predicate : any) => Promise<any>,
  findOneAndUpdate: (predicate : any, updates : any, options : any) => Promise<any>,
  findOneAndDelete: (predicate : any) => Promise<any>
}
