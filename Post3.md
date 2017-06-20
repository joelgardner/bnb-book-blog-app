## Build a new React / Node.js application

### Part 3: A realistic application

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

#### Creating objects: User and Room

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
