import { connectToStorage, disconnectFromStorage, insertOne, fetchOne, deleteOne, updateOne } from '../src/services/storage'

let db;
beforeAll(async () => {
  (await connectToStorage())
  .map(_db => {
    db = _db
    //console.log("Connected to Mongo")
  })
  .orElse(e => {
    console.log(e)
    process.exit(1)
  })
})

afterAll(async() => {
  await disconnectFromStorage()
})

test('insertOne creates a document, deleteOne deletes it', async () => {
  const insertResult = await insertOne('testDocuments', { test: 1 })
  const inserted = insertResult.getOrElse('failure')
  expect(inserted).toHaveProperty('test', 1)

  const fetchResult = await fetchOne('testDocuments', inserted.id)
  const fetched = fetchResult.getOrElse('failure')
  expect(fetched).toHaveProperty('test', 1)

  const deleteResult = await deleteOne('testDocuments', fetched.id)
  const deleted = deleteResult.getOrElse('failure')
  expect(deleted).toEqual(fetched)
});

test('updateOne modifies a document', async () => {
  const insertResult = await insertOne('testDocuments', { test: 1 })
  const inserted = insertResult.getOrElse('failure')
  expect(inserted).toHaveProperty('test', 1)

  const updateResult = await updateOne('testDocuments', inserted.id, { newKey: 'boom' })
  const updated = updateResult.getOrElse('failure')
  expect(updated).toHaveProperty('newKey', 'boom')

  const deleteResult = await deleteOne('testDocuments', updated.id)
  const deleted = deleteResult.getOrElse('failure')
  expect(deleted).toEqual(updated)
});
