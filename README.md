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
