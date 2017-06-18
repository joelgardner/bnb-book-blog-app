## Build a new React / Node.js application

### Part 2: Building our API backend

#### Structure
Just like we created a `client` folder in Part #1, we'll create a `server` folder now.  In our top-level directory:

`mkdir server && cd server/ && npm init --yes`

This will create our folder, and add another (empty) `package.json` to it.  Let's add some of our productivity tools from Part #1:

`npm i --save ramda immutable`

`npm i --save-dev eslint flow-bin`

It would be great if we could re-use our previous `.eslint.*` file from the client folder.  Luckily, it's super easy to do so.  Just move the `.eslint.*` file up and out of `client`.  In our top-level directory:

`mv client/eslint.json .`

Check to see that `npm run lint` still works (you'll need to `cd` into `client`, of course).  And now we can use it to also lint our server javascript as well.
