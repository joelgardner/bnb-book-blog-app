## Build a new React / Node.js application

### Part 2: Setting up our Backend

#### Structure
Just like we created a `client` folder in Part #1, we'll create a `server` directory now.  In our top-level directory:

`mkdir server && cd server/ && npm init --yes && mkdir src __tests__ && touch src/index.js`

This will create our folder, and add another (empty) `package.json` to it.  Let's add our productivity tools from Part #1:

`npm i --save ramda immutable`

`npm i --save-dev eslint flow-bin`

It would be great if we could re-use our previous `.eslint.*` file from the client folder.  Luckily, it's super easy to do so.  Just move the `.eslint.*` file up and out of `client`.  In our top-level directory:

`mv client/eslint.json .`

Check to see that `npm run lint` still works (you'll need to `cd` into `client`, of course).  And now we can use it to lint our server javascript as well.

#### Go with the flow
As mentioned previously, we'll use the Flow tool to allow us to annotate our code with types, reducing the probability of silly bugs we'd otherwise catch (or not) at runtime.  Let's add that now.  In our `server/package.json`, add `"flow": "flow"` under the `scripts` property.  

As we write code, we'll annotate it with types, which Flow will check and warn us if we're misstepping.

> You can run `npm run flow` now to see the typechecker initialize itself, check our (nonexistent) code, and return "No errors!"

#### Build an Express API
We'll use the *old reliable* of Node server libraries: [Express](https://expressjs.com/).  It's simple, flexible, and ubiquitous.  There are other libraries which may be more hip, but Express is the grizzled old veteran of the API wars.  Its [middleware](https://expressjs.com/en/guide/writing-middleware.html) capabilities are well-understood and many libraries have been written for things like request parsing, authentication, caching, logging, etc.  

Let's get started.  In our `server` directory:

`npm i --save express body-parser`

Now, in `src/index.js` (which is empty), let's add:

```js
// @flow
'use strict'
import express from 'express'
import bodyParser from 'body-parser'

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// we'll change these lines
import sum from './sum'
app.get('/sum', (req, res) => {
  const { a, b } = req.query
  res.status(200).send(sum(+a, +b).toString())   // coerce a and b into integers with +
})

app.listen(3001, () => {
  /* eslint-disable no-console */
  console.log('Listening on port 3001.')
  /* eslint-enable no-console */
})
```

Additionally, create a `sum.js` file in `src` with contents:

```js
export default function sum(a, b) {
  return a + b
}
```

Now if we tried `node src/index.js` at this point, Node would complain:

```
/Users/jroot/Dev/react-node-app/server/src/index.js:3
import express from 'express';
^^^^^^

SyntaxError: Unexpected token import
```

That's because we need to use Babel to transpile ES6/7 code to the type of javascript code that Node understands (to be fair, Node understands quite a bit of ES6/7, but it does not yet support `import` statements).

So let's install Babel and its sub-dependencies:

`npm i --save-dev babel-cli babel-eslint babel-plugin-transform-class-properties babel-plugin-transform-flow-strip-types babel-preset-env eslint-plugin-babel eslint-plugin-flow-header eslint-plugin-flowtype eslint-plugin-react`

Yeah... it's quite a bit.  Suffice it to say we're installing the main Babel CLI package plus a bunch of Babel plugins, presets, and a few more eslint plugins.

> Note, in newer versions of npm (>= 5?), a "lock file" is created by the above command: `npm notice created a lockfile as package-lock.json. You should commit this file.` We'll take npm's word for it and commit this file.

Now, we'll add a `.babelrc` file in our `server` folder, which Babel needs in order to transpile our code:

`touch .babelrc`

Set `.babelrc`'s contents to:
```json
{
  "plugins": [
    "syntax-flow",
    "transform-flow-strip-types",
    "transform-class-properties"
  ],
  "presets": ["env"]
}
```

Now, run the following:

`./node_modules/.bin/babel-node src/index.js`

You should see that the server is now `Listening on port 3001.`  Try running `curl localhost:3001/sum?a=1\&b=2`.  You'll see that 1 + 2 is in fact 3.  Woohoo!

You might be thinking: "that's a lot of work to get a Node app up and running."  Definitely.  And it's part of the boilerplate mentioned in Part #1, except this time we don't have `create-react-app` holding our hand to run it on the server.  But, once it's done, it's done, and we can add commands to our `package.json`'s `scripts` property to make life easier:

```json
"babel": "./node_modules/.bin/babel src --out-dir out",
"build": "npm run check && rm -rf out/ && npm run babel",
"check": "npm run lint && npm run flow",
"lint": "./node_modules/.bin/eslint src/ || true",
"flow": "flow; test $? -eq 0 -o $? -eq 2",
"babel-node": "./node_modules/.bin/babel-node src/index.js",
"watch": "nodemon --exec \"npm run babel-node\""
```

The last one, `watch`, uses [nodemon](https://nodemon.io/).  If you don't have it installed, do so with `npm i -g nodemon`.  This is the command we'll use when we're developing, as it restarts our app when it notices a change.

`build` will copy the babel output to a folder `out` (assuming we can `npm run check` without issues).  As such, we'll add a line to our project's `.gitignore`: `server/out`.  This is so we don't commit our build artifacts to source control.

The rest of the commands should be familiar and/or self-explanatory.

#### Where are the tests!?

We must not forget to test, so let's install Jest (remember, we got it for free with `create-react-app` in `client` but we aren't using `create-react-app` here in `server`, so we must be explicit).

`npm i --save-dev jest`

In our `__tests__` folder, create a file `index.js`, and set its conents to:

```js
import sum from '../src/sum'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

Then a simple `./node_modules/.bin/jest` should run our test.  Let's make life easier by editing our `package.json`'s `test` command under the `scripts` property to look like so:

`"test": "./node_modules/.bin/jest"`

Now we can run our tests by doing `npm test` (or even `npm t`!).

#### Hitting the API from our app

A curl request is nice, but we're building an app here.  Let's make the connection between our client and server.
For now, we'll assume that our app is a calculator that adds two numbers.  

> Would you look at that!  We've already built that capability on the backend.  How convenient.

So, let's switch over to our `client` project.  We'll need a way for the user to enter two numbers, and a way for the client to request that the server add these numbers and return the result.  I can envision two inputs and a button.  Change your `App.js` to look like the following:

```js
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as api from './api'

class App extends Component {
  constructor() {
    super()
    this.state = {
      a: 0,
      b: 0,
      sum: null,
      error: null
    }
  }

  render() {
    return (
      <div className="App">
        <div>
          <span>A</span>
          <input type="number" defaultValue={this.state.a} onChange={e => this.setState({ a: e.target.value })} />
        </div>
        <div>
          <span>B</span>
          <input type="number" defaultValue={this.state.b} onChange={e => this.setState({ b: e.target.value })} />
        </div>
        <div>
          <button onClick={() => this.handleClick(this.state.a, this.state.b)}>Calculate!</button>
        </div>
        <span>{this.state.sum === null ? '' : `The sum is ${this.state.sum}`}</span>
        <span style={{ color:'#f00' }}>{this.state.error}</span>
      </div>
    );
  }

  async handleClick(a, b) {
    try {
      const result = await api.sum(a, b)
      this.setState({ sum: result, error: null })
    }
    catch (e) {
      this.setState({ error: e.toString(), sum: null })
    }
  }
}

export default App;
```

As you can see, we have two inputs and a button.  When the button is clicked, we'll use the `sum` import from our `api.js`, which looks like this:

```js
export function sum(a, b) {
  return send(`http://localhost:3001/sum?a=${a}&b=${b}`)
}

async function send(url, options) {
  const res = await fetch(url, options)
  if (!res.ok) {
    const err = new Error(await res.text())
    return Promise.reject(err)
  }
  return res.text()
}

```
> It's worth noting here that we're using the new `async`/`await` syntax in ES7.  This allows us to write asynchronous code (i.e., send a fetch request) as if it were synchronous.  If the request fails, we return a rejected Promise, which is captured in the `catch` by the calling function (`handleClick`).  Nice!

Make sure you're running both the client (`npm start`) and the server (`npm run watch`).  Navigate to `localhost:3000`, and (finally) enter numbers into the inputs and click *Calculate!*.

Whaaa?  The astute observer might've already made the connection that an app running on `localhost:3000` can't send a request to `localhost:3001` without the appropriate [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) headers.

Sure enough, we'll see a bunch of red text in the browser's console that looks like the following:
```
Fetch API cannot load http://localhost:3001/sum?a=-2&b=2. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:3000' is therefore not allowed access. The response had HTTP status code 500. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
```

Everything's OK, we just need to tweak our `client/package.json` file a bit.  `create-react-app` sets up a service to serve our client app on `localhost:3000`, but our backend server is running on `localhost:3001`.  Luckily, we can tell our client app to proxy requests over to our backend app by adding the following line to `client/package.json`'s top level:

```json
"proxy": "http://localhost:3001"
```

This is forces the client server to forward requests to our backend server.

One last change: in `api.js`, remove the `http://localhost:3001` part of the URL, so that it's just `/sum?a=${a}&b=${b}`.

Now, pressing the *Calculate!* button should display text indicating the result.

#### Now for a real app
This has been... uhh, fun.  Sure.  But the end result is that we have a client that can interact with our backend via an API.  In our next post, we'll create a realistic app that uses GraphQL to communicate with our backend.  Keep reading!
