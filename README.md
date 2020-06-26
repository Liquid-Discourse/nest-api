# Liquid Discourse NestJS API

- [Liquid Discourse NestJS API](#liquid-discourse-nestjs-api)
  - [Docs](#docs)
  - [Installation](#installation)
  - [Running the app](#running-the-app)
  - [Potential problems](#potential-problems)
  - [Test](#test)

## Docs

<http://liquid-discourse-api.herokuapp.com/docs>

## Installation

Use `yarn` for everything, not `npm`.

```bash
$ yarn install
```

## Running the app

First, get the `.env` file from the Notion page and put it in the root directory. Here are all the values the `.env` file should contain:

```
# server port
PORT=

# this is used to connect to the databsse
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=

# this is used to force sync schema changes
# if this is set to false, we need to figure out migrations
DATABASE_SYNCHRONIZE=

# Auth0 auth service (verify incoming JWT)
AUTH0_DOMAIN=
AUTH0_AUDIENCE=

# Auth0 management service (query for user data)
AUTH0_MANAGEMENT_CLIENT_ID=
AUTH0_MANAGEMENT_CLIENT_SECRET=
```

With the `.env` in place, you can run the following commands to start the dev server:

```bash
# watch mode (recommended for dev)
$ yarn run start:dev

# development
$ yarn run start

# production mode
$ yarn run start:prod
```

## Potential problems

> Error connecting to database after schema change

- Try deleting the database, creating one again, and restart API
- Or, try to delete the table causing the trouble, and then restart API

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
