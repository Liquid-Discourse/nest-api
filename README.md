# Liquid Discourse NestJS API

- [Liquid Discourse NestJS API](#liquid-discourse-nestjs-api)
  - [Docs](#docs)
  - [Installation](#installation)
  - [Running the app](#running-the-app)
  - [Test](#test)

## Docs

<http://liquid-discourse-api.herokuapp.com/docs>

## Installation

Use `yarn` for everything, not `npm`.

```bash
$ yarn install
```

## Running the app

First, get the `.env` file from the Notion page and put it in the root directory. Then you can run the following commands:

```bash
# watch mode (recommended for dev)
$ yarn run start:dev

# development
$ yarn run start

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
