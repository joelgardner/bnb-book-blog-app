## Build a new React / Node.js application

### Part 3: A realistic application

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

We'll obviously need a way for B&B owners to sign up for our app.  Guests however can book anonymously.

#### Backend business logic / models
As stated earlier, we'll use GraphQL to serve our API.  GraphQL provides a language that describes our API and doubles as a way to automatically build the schema as well.  Let's define our models:

```
type User {
  id: ID!
  email: String!
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
