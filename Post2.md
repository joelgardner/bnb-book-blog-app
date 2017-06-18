## Build a new React / Node.js application

### Part 2: Building our API backend

#### Structure
Just like we created a `client` folder in Part #1, we'll create a `server` folder now.  In our top-level directory:

`mkdir server && cd server/ && npm init --yes`

This will create our folder, and add another (empty) `package.json` to it.  Let's add some of our productivity tools from Part #1:

`npm i --save ramda immutable`

`npm i --save-dev eslint flow-bin`

> It would of course be nice if we could re-use our previous `.eslint.*` file from the client folder.  Further down, we'll do just that.  But for now, let's keep this separate one.
