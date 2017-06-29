## Build a new React / Node.js application

### Part 3: Setting up our Backend... continued

> NOTE: You'll need to be running Node version >= 8.0 for the following.  So if you don't have that one installed, do so.  Check out the [nvm](https://github.com/creationix/nvm) package if you'd like some assistance.

#### Concurrently
You might've been bothered by the fact that to run our application, we have to run two commands inside two different terminal windows: in `client`, we run `npm start` and in `server`, we run `npm run watch`.

We'll use [Concurrently](https://www.npmjs.com/package/concurrently) to fix this by running everything with a single command.  

In our top level directory, run:

`npm init --yes && npm i --save-dev concurrently`

This creates a `package.json` and installs the Concurrently tool.  We will add the following line to the `scripts` key in `package.json`:

`"start": "./node_modules/.bin/concurrently \"cd client && npm start\" \"cd server && npm run watch\""`

Kill the `server`/`client` processes if necessary, and then run `npm start` in the top-level folder.  This will start both the client and server applications with a single command.  Much more convenient!

#### Real world example
Our calculator app is marvelous, but let's build something a bit more realistic.  We'll create a simple booking application for B&Bs.  The basic features we'll build are:
- a way to manage room inventory.  Rooms will have a name, price, description, and an image
- a way for guests to browse and book rooms by date
- a way for B&B owners to sign up for our app (guests however can book anonymously)

#### Backend business logic / models
As stated earlier, we'll use GraphQL to serve our API.  GraphQL provides a language that describes our API and doubles as a way to automatically build the schema as well.  Let's define our models in a new file,  `src/schema.graphql`:

```
type User {
  id: ID!
  email: String!
}

type LocalAuth {
  id: ID!
  user: User!
  password: String!
}

type Property {
  id: ID!
  owner: User!
  address: Address
  rooms: [Room]
}

type Address {
  street1: String!
  street2: String
  city: String!
  state: String!
}

type Room {
  id: ID!
  name: String!
  price: Float
  description: String
  image: File
}

type File {
  id: ID!
  url: String!
}
```

This is a very basic schema that will allow us to build our B&B Booking app.  It simply creates some types that define the data we need to manage and book properties.  

>As far as schemas go, this is about as simple as you can get in GraphQL, which is capable of much more than what we'll use for this simple application.  Go ahead and read the GraphQL [documentation](http://graphql.org/learn/) to get a feel for the possibilities.

Now let's install the GraphQL library:

`npm i --save graphql`

#### Microservices

Before we get to the nitty-gritty, let's take a moment to think about our server architecture.  We'll break our application into microservices.  We will use the [Seneca.js](http://senecajs.org/) library to facilitate our services.  Let's think about the services we need:
- `gateway` - we definitely need a service that receives client requests and sends back a response
- `booking` - we need a service to perform our booking logic
- `inventory` - a service to maintain our room inventory
- `storage` - a service to interact with our Postgres database to perform C.R.U.D. operations
- `image` - we'll use this service to interact with Amazon S3 to store the images associated with each room.  

> You could argue `image` should be part of the `inventory` service.  But what if we want to implement a feature allowing guests to post pictures they've taken on their trips?  This way, we'll have a service that basically does what we want already, without having to extract such logic from `inventory`.

Don't let the term *microservice* scare you.  It's a fancy way to describe a class or function (or set of functions).  A microservice should be independently deployable.  One microservice handles one aspect of our business logic.  The opposite of a microservice architecture is a monolith, in which all code is a huge, single project wherein a single part cannot be broken out independently.  

As with everything in software, there are tradeoffs.  In a monolith, a service invoking another service is probably just a nice, easy function call.  In a microservices architecture, the same two services don't necessarily live inside the same process.  Thus, invocation must be done over some other transport method: http, ipc, tcp, etc(p).

This is where Seneca comes in.  It takes care of the inter-service communication, and all we need to think about is the arguments and result each service sends and receives.

`npm i --save seneca`

#### Creating Users

Let's implement an API call to create users, and then some inventory.  Add the following to our `schema.graphql` file:

```
type Query  {
  getUser(id: ID!) : User
}

type Mutation {
  createUser(email: String!) : User
}
```
Create a `gateway` folder in `src`, and inside it, add a `resolvers.js` with contents:

```
import R from 'ramda'

const users = [
  { id: 0, email: 'toby@dundermifflin.com' },
  { id: 1, email: 'jim@dundermifflin.com' },
  { id: 2, email: 'pam@dundermifflin.com' },
  { id: 3, email: 'dwight@dundermifflin.com' },
  { id: 4, email: 'michael@dundermifflin.com' },
  { id: 5, email: 'andy@dundermifflin.com' },
]

export function getUser({ id }, context) {
  return users[id]
}

export function createUser({ email }, context) {
  users.push({ id: users.length, email })
  return R.last(users)
}
```

Finally, change our `src/index.js` file to look like the following:

```js
// @flow
'use strict'
import express from 'express'
import bodyParser from 'body-parser'
import { graphql, buildSchema } from 'graphql'
import fs from 'fs'
import { promisify } from 'util'
import * as Root from './gateway/resolvers'

init()

async function init() {
  const app = express()
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  // read in the schema.graphql file, and build our schema with it
  const readFile : (string, string) => Promise<string> = promisify(fs.readFile)
  const gql : string = await readFile(`${__dirname}/schema.graphql`, 'utf8')
  const schema : Object = buildSchema(gql)
  app.post('/graphql', async (req, res) => {
    const { query, args } = req.body
    const result : Object = await graphql(schema, query, Root, { user: 'Bill' }, args)
    res.send(result)
  })

  app.listen(3001, () => {
    /* eslint-disable no-console */
    console.log('Listening on port 3001.')
    /* eslint-enable no-console */
  })
}
```

We're now listening at `/graphql` for requests.  Let's test our endpoint.  Run the following curl request:

`curl -X POST localhost:3000/graphql -H "content-type: application/json" -d '{ "query": "query GetUserById($id: ID!) { getUser(id: $id) { id email } }", "args": { "id": 3 } }'`

You should be getting the response:

`{"data":{"getUser":{"id":"3","email":"dwight@dundermifflin.com"}}}`

Woohoo!  Let's create a new user:

`curl -X POST localhost:3000/graphql -H "content-type: application/json" -d '{ "query": "mutation CreateUser($email: String!) { createUser(email: $email) { id email } }", "args": { "email": "kevin@dundermifflin.com" } }'`

This should return:

`{"data":{"createUser":{"id":"6","email":"kevin@dundermifflin.com"}}}`

It's good to include Kevin.  If you run the above GraphQL *query* (as opposed to the *mutation*), with the `id` changed to `6`, we'll also get Kevin back, proving he's now in our "database."

I used quotes around the word *database* because as I'm sure you've noticed, we're simply using an in-memory array to store our users.  Let's change that.

#### Enter Mongo
If you haven't already, [install Mongo](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/).  

Done?  Created your `/data/db` directory?  Run the `mongod` command to make sure everything's set.  *CTRL-C* out of it and let's add that to our top-level `package.json`'s `start` command:

`"start": "./node_modules/.bin/concurrently \"cd client && npm start\" \"cd server && npm run watch\" \"mongod\""`

> If you are using Mongo DB for more than 1 project, it probably makes less sense to do the previous step, and instead, just maintain an extra (permanent) terminal window to run the Mongo server from.

Now when we run `npm start` in our base directory, we'll kick off 3 processes: the client and server apps, and Mongo.

Let's now install the Node.js mongodb driver.  In `server/`:

`npm install mongodb --save`

Let's add a `storage` folder under `server`.  It will house the files we use for persistence to our Mongo instance:

`mkdir storage && touch storage/index.js`

To start, we'll use Mongo's basic C.R.U.D. operations: `insertMany`, `find`, `update`, and `deleteMany`.  They map nicely to the [mutations](http://graphql.org/learn/queries/#mutations) we'll create for our GraphQL schema.

In `storage/index.js`, we'll have the following:

```js
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
```
> Note that we're defining a `const url` to hold our Mongo server's URL.  Eventually, we'll need to be more robust with this and use a proper configuration library.  But for now, this is fine.

Most methods are self explanatory.  `setupStorage` simply creates a connection to the Mongo server and returns the context if successful.  Catalogs are strings that reference the document type we're dealing with.  

We're using `async`/`await` here so that we can use a simple `try/catch` to handle any errors that popup when interacting with Mongo.  For now we'll just log and return the `Error` object passed to the `catch`.

Let's not forget our tests!  We'll write some simple tests in a new file, `__tests__/mongo-tests.js`:

```js
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
    { test2: 2 }      // update:    set test2=2
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
```

In addition to verifying that everything's running smoothly, these tests provide a way to see how our `storage` service will work.

One more thing.  We need to have our main script call `setupStorage` when the app loads:  we'll just add these two lines after the `app.use(bodyParser.urlencoded({ extended: true }))` line in `src/index.js`:

```js
// mongo setup
await setupStorage()
```

We just wait for the `setupStorage` function to finish, and discard the return value (we don't need it).

Now that our Mongo server is creating/reading/updating/deleting, we can start to build our queries and mutations.  
