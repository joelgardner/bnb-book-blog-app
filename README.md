#### React/Redux frontend using GraphQL to interact with a Node/Mongo backend

#### Start the app
- Run `mongod` to start the MongoDB server instance
- In the base directory, run `npm start`, which in turn:
  - Runs `npm start` in `client`
  - Runs `npm run watch` in `server`


#### Testing
- Run `npm t` in either `client` or `server`

#### Building the app
- Frontend: In `client`, running `npm run build` will output static files into `client/out`
- Backend: In `server`, running `./scripts/build-service.sh gateway|storage` will build the passed in service (e.g., `gateway` or `storage` in `build`.  Simply copy the output directory and run `npm install && npm start`)

#### Database migrations
In `server`:
- `npm run db-migrate-up` will run all of our migrations' `up` functions.
- `npm run db-migrate-down` will run a single migration's `down` function (this is a `db-migrate` default).  To run more than one, you can run `npm run db-migrate-down -- -c 2`, the *2* represents the number of down migrations you want to run (from the current state).
- `npm run db-migrate-create -- createStuff` will create a new migration file, e.g., `20170630070556-createStuff.js`.
- `npm run db-migrate-dropdb` will drop our *bnb-book* database in our Mongo instance.  It guards against an accidental execution with a prompt.
- `npm run db-migrate-createdb` will create an empty *bnb-book* database in our Mongo instance.
