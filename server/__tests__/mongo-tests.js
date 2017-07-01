import { connectToStorage, insertOne, fetchOne, deleteOne, updateOne } from '../src/services/storage'

beforeAll(async () => {
  (await connectToStorage())
  .map(() => {
    //console.log("Connected to Mongo")
  })
  .orElse(e => process.exit(e))
})

test('insertOne creates a document, deleteOne deletes it', async () => {
  const insertResult = await insertOne('testDocuments', { test: 1 })
  const inserted = insertResult.getOrElse('failure')
  expect(inserted).toHaveProperty('test', 1)

  const deleteResult = await deleteOne('testDocuments', inserted.id)
  const deleted = deleteResult.getOrElse('failure')
  expect(deleted).toEqual(inserted)
});
//
// test('updateOne modifies a document', async () => {
//
//   let { result } = await updateOne('testDocuments',  // catalog
//     { test: 1 },      // predicate: update documents with test=1
//     { test2: 2}       // update:    set test2=2
//   )
//   expect(result.n).toBeGreaterThan(0)
// });
//
// test('select retrieves documents with empty filter', async () => {
//   let results = await select('testDocuments', {})
//   expect(results.length).toBeGreaterThan(0)
// });
//
// test('select retrieves documents with filter', async () => {
//   let results = await select('testDocuments', { test2: 2 })
//   expect(results.length).toBe(1)
// });
//
// test('remove deletes documents', async () => {
//   let { result } = await remove('testDocuments', {})
//   expect(result.n).toBeGreaterThan(0)
// });
