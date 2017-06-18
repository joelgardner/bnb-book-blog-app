## Build a new React / Node.js application

### Part 1: Basic technologies overview

#### Backend
As stated in the title of this post, we'll use [Node.js](https://nodejs.org) to run our backend code.  For our data store, we'll pick [Postgres](https://www.postgresql.org/).  And we'll serve our API via [GraphQL](http://graphql.org/) to interact with our frontend.  As an alternative to the traditional REST API, it relies not on URLs for accessing resources but customizable queries which allow us to extract only the data we want from our backend.

>*While we could have chosen a NoSQL data-store like [Mongo](https://www.mongodb.com/) for our data store, I'm a fan of a strictly defined and adhered-to schema.  In the event we need to utilize some NoSQL style functionality, Postgres' `jsonb` type is up to the task.*

#### Frontend
Let's use [React](https://facebook.github.io/react/) and [Redux](http://redux.js.org/), as the pair provides a simple way to reason about the data-flow and state inside our app.  

>*[Vue.js](https://vuejs.org/) is another library that's enjoying a ton of use, and some people swear by it over React.  But as I said earlier, I'm a loyal soldier (and I'm not a big fan of the Angular-like html attributes Vue employs, but to each their own!).*

We'll use the amazing [create-react-app](https://github.com/facebookincubator/create-react-app) package to supercharge our setup time.  It provides tons of boilerplate we'd otherwise have to write ourselves to get stuff like [Babel](https://babeljs.io/) and [Webpack](https://webpack.js.org/) working.  Run the following:

`npm i -g create-react-app`

`create-react-app client`

After the text stops flowing, drop into our newly created *client* folder and run `npm start`.  Bam! We're off and running.  Visit *http://localhost:3000/* in your browser and you should see the React logo spinning around.

>*You really should read all of the documentation on create-react-app's GitHub.  It provides detailed walkthroughs to just about anything you could think to add or change in the default application.*

>*Additionally, if you haven't, please, please, please, read the Redux [documentation](http://redux.js.org/docs/introduction/Motivation.html).  Basically, this post will provide some of the "how," but the documentation provides that, plus the "why" -- which is arguably more important!*

Stop the server with *ctrl+c* and we'll also add Redux and its bindings with React.  To facilitate asynchronous actions, we'll use the awesome [Redux Saga](https://github.com/redux-saga/redux-saga) library, which is an alternative to the more traditional [Redux Thunk](https://github.com/gaearon/redux-thunk) middleware plugin.

`npm i --save redux react-redux redux-saga`

Additionally, we'll throw in a UI framework called [Bulma](http://bulma.io/).  It's strictly CSS; no javascript, which is comforting.  It's got great documentation and lots of stars on Github.

`npm i --save bulma`

#### Testing, testing, 1-2-3

Of course, we also need a way to easily test the code we're writing.  For that, we'll use the [Jest](https://facebook.github.io/jest/) library.  It works well with React, and in fact, it comes bundled with `create-react-app`'s output.  Try running `npm test` (or `npm t`).  It invokes the Jest testrunner, which executes our tests.  See `App.test.js` for an example.  It also would work as `App.spec.js` or `__tests__/*.js`.  More on Jest later.

#### Project-wide .gitignore
`create-react-app` adds a nice default `.gitignore` file to our `client` directory.  But ideally we want the `.gitignore` to apply to the entire project structure.  Let's hoist it out of `client` and into our top-level directory:

`mv client/.gitignore .`

Additionally, we'll make a change to it to ignore all `node_modules` directories.  Here's the diff of the change we want:

```diff
+ node_modules/
- /node_modules
```

Moving the slash to the end will force git to ignore all module folders, instead of only ones inside the same directory as the `.gitignore` file.

#### Productivity libraries
Some productivity tools that we'll use are [Flow](https://flow.org/), [ESLint](http://eslint.org/),  [Ramda.js](http://ramdajs.com/), and [Immutable.js](https://facebook.github.io/immutable-js/).

With Flow, we can augment our javascript code with  type annotations, which the Flow typechecker can reason about and warn against.  This helps us avoid silly errors that would otherwise manifest at runtime when writing regular javascript.  

ESLint is a tool that will warn us if we stray from our style-guidelines.  It helps us maintain a consistent coding style by enforcing a customizable list of rules.

`npm i --save-dev flow-bin eslint`

Let's configure ESLint.  Run the following:

`./node_modules/.bin/eslint --init`

It will bring up an interactive prompt that will ask how you want to set up your styling.  You can choose to have it ask you questions about your style or just run with a popular style-guide such as AirBnB or Google's.  The end result is a new file called `.eslint`, which can be JS, YAML, or JSON.  Once that's done, just run the follow to lint our code:

`./node_modules/.bin/eslint src/index.js`

You'll notice that it's marking variables as unused even though we're using them as JSX:

```
1:8    error  'React' is defined but never used  no-unused-vars
12:11  error  'App' is assigned a value but never used  no-unused-vars
```

To alleviate this, add the following two rules to the `"rules"` property in our `.eslintrc` file:

```
"react/jsx-uses-react": 1,
"react/jsx-uses-vars": 1
```

With these rules, the linter will no longer incorrectly complain about unused variables.

Now, let's add a `lint` command to our `package.json`'s `scripts` property':

`"lint": "./node_modules/.bin/eslint src/*.js || true"`

Now, to lint our app, we simply run `npm run lint`.  The `|| true` suppresses the typical npm error boilerplate (go ahead, try running `npm run lint` with and without the `|| true` present.)

> Whew!  ESLint definitely adds some setup overhead but is invaluable in helping maintain clean, consistent code.  We'll re-visit it periodically to update our rules.

#### Function junction

I'm a big fan of the functional programming style and while [Functors, Applicatives, and Monads](http://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html) are beyond the scope of this post, it's possible to write javascript in a clean, concise, functional style and that's what we'll aim to do here.

>*Object-oriented programming was king for a long time, but there is currently a sea change toward the functional paradigm.*

Javascript has its warts, but the ES6/7 spec has really made for a fun and expressive language.  It's no Haskell, but combined with a library or two, Javascript can truly be a very capable and functional-style language.  We'll use Ramda.js to help us with this.  It provides many helpful utility functions that embrace and encourage functional code as each method is curried (i.e., you can partially apply it).

>*Another great library is [lodash](https://github.com/lodash/lodash)/[fp](https://github.com/lodash/lodash/wiki/FP-Guide).*

Finally, we'll use Immutable.js which is a library of collections that play well with React and Redux because they are... well, immutable.  One way this helps is that it allows for super-fast reference equality checks (think `===` vs `==`) instead of deep comparisons to determine whether or not a component should be re-rendered.  It also allows for cleaner, more readable code in our Redux [reducers](http://redux.js.org/docs/basics/Reducers.html).

`npm i --save immutable ramda`

#### The new hotness
We want to utilize hot-reloading so that our app automatically updates when we make code changes.

You might say, "*but, the app is already reloading when I change it!*"  That's true, but it completely refreshes the page.  This is fine for when our app is small and simple, but for a more complex application, a refresh can cause us to lose our place -- or worse -- our state.  *Hot*-reloading simply updates the changed component on the page, without a full page refresh, thus maintaining our state.

To enable hot-reloading, all we have to do is add some code to the bottom of our `src/index.js` file:

```js
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    ReactDOM.render(
      <NextApp />,
      document.getElementById('root')
    )
  })
}
```

After adding this code, change the code in `App.js` or `App.css` and watch the magic happen.

>*Credit to [superhighfives](https://medium.com/superhighfives) and [this post](https://medium.com/superhighfives/hot-reloading-create-react-app-73297a00dcad) for that one.*


#### 'Til next time!
We're done with our initial setup.  In Part 2 of this post, we'll get our Node server up and running and make our first API request.
