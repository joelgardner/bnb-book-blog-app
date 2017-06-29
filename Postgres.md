
#### Enter Postgres

To create our, make sure we have [Postgres installed](https://www.postgresql.org/download/).

> There are myriad posts/articles describing how to get Postgres up and running, so I won't go into that here.  Use your Google-fu and come back when you can run SQL commands.  Go ahead, we'll wait.

Now, create a database called `bnb-book`:

`create database "bnb-book"`

In our `server` folder, create a `scripts/database/migrations` directory:

`mkdir -p scripts/database/migrations && cd scripts/database`

To maintain order among a sea of database changes, we'll use a db migrations management library (aptly called) [db-migrate](https://github.com/db-migrate/node-db-migrate).  In our server folder, run:

`npm i --save-dev db-migrate db-migrate-pg`

Then create a file `scripts/database/database.json` with content:

```json
{
  "dev": {
    "driver": "pg",
    "user": "postgres",
    "password": "",
    "host": "localhost",
    "database": "bnb-book",
    "schema": "public"
  }
}
```

> NOTE: For credentials, my installation uses `postgres` as username, and the empty string as the password.  Your installation may be different, and if so, update those values in your file.

This points out dev database to our local Postgres instance.  Now, let's run the following command in `server` as a check.

`./node_modules/.bin/db-migrate up --config scripts/database/database.json --migrations-dir scripts/database/migrations/`

Hopefully you'll see:

```
[INFO] No migrations to run
[INFO] Done
```

This means we're ready to create our first migration file.  But first, let's make it easier on ourselves and put the above command into our `package.json`'s `scripts` property as:

`"migrate": "./node_modules/.bin/db-migrate up --config scripts/database/database.json --migrations-dir scripts/database/migrations/"`

Then we'll only need to run `npm run migrate` to perform our DB migrations.

Let's now create a couple migrations to build out our database schema:

`./node_modules/.bin/db-migrate create --config scripts/database/database.json --migrations-dir`

```sql
-- TODO
```

> For this application, we will -- against our better judgement -- use monotonic integers for IDs for our rows.  In a real application that cares about data security, we'd use uuids or something [like this](https://blog.andyet.com/2016/02/23/generating-shortids-in-postgres/).
