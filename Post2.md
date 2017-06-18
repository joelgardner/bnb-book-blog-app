## Build a new React / Node.js application

### Part 2: Building our API backend

#### Structure
Just like we created a `client` folder in Part #1, we'll create a `server` directory now.  In our top-level directory:

`mkdir server && cd server/ && npm init --yes && mkdir src test && touch src/index.js`

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
'use strict';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// we'll change this line
app.get('/', (req, res) => res.send('Hello World'));

app.listen(3001, () => console.log('Listening on port 3001.'));
```
Now if we tried `node src/index.js` at this point, Node would complain:

```
/Users/jroot/Dev/react-node-app/server/src/index.js:3
import express from 'express';
^^^^^^

SyntaxError: Unexpected token import
```

That's because we need to use babel to transpile ES6/7 code to the type of javascript code that Node understands (which, to be fair, understands quite a bit of ES6/7, but it does not support `import` statements yet).

So let's install babel and its sub-dependencies:

`npm i --save-dev babel-cli babel-eslint babel-plugin-transform-class-properties babel-plugin-transform-flow-strip-types babel-preset-env eslint-plugin-babel eslint-plugin-flow-header eslint-plugin-flowtype eslint-plugin-react`

Yeah... it's quite a bit.  Suffice it to say we're installing the main Babel CLI package plus a bunch of Babel plugins, presets, and a few more eslint plugins.

> Note, in newer versions of Node (>= 8), a "lock file" is created by the above command: `npm notice created a lockfile as package-lock.json. You should commit this file.` We'll take npm's word for it and commit this file.

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

You should see that the server is now `Listening on port 3001.`  Try running `curl localhost:3001`.  Woohoo!

You might be thinking: "that's a lot of work to get a Node app with `import` statements up and running."  Definitely.  And it's part of the boilerplate I mentioned in Part #1, except we don't have `create-react-app` holding our hands to run it on the server.  But, once it's done, it's done, and we can add commands to our `package.json`'s `scripts` property to make life easier:

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
