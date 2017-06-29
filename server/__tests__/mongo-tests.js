import { setupStorage, insert, select, remove, update } from '../src/storage'

beforeAll(async () => {
  let db = await setupStorage()
})

test('insert creates documents', async () => {
  let { result } = await insert('testDocuments', [{ test: 1 }, { test: 2 }, { test: 3 }])
  expect(result.ok).toBe(1)
  expect(result.n).toBe(3)
});

test('update modifies documents', async () => {
  let { result } = await update(
    'testDocuments',  // catalog
    { test: 1 },      // predicate: update documents with test=1
    { test2: 2}       // update:    set test2=2
  )
  expect(result.n).toBeGreaterThan(0)
});

test('select retrieves documents with empty filter', async () => {
  let results = await select('testDocuments', {})
  expect(results.length).toBeGreaterThan(0)
});

test('select retrieves documents with filter', async () => {
  let results = await select('testDocuments', { test2: 2 })
  expect(results.length).toBe(1)
});

test('remove deletes documents', async () => {
  let { result } = await remove('testDocuments', {})
  expect(result.n).toBeGreaterThan(0)
});
