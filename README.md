# Northcoders News

Northcoders News is a reddit style back-end API for news app for Northcoder internal news. Articles and comments can be posted by users. App users can also upvote or downvote articles and comments.

## Prerequisites

Ensure you have at least NodeJS v10.1.0 and MongoDB v3.6.5 installed on your machine. JavaScript code has been written to ES6 standard.

## Installing

1. Fork and clone this repository to your machine
2. Using terminal cd to the cloned directory and run this command:

```
npm install
```

3. Create a directory named 'config' in the root of this repository. Create file 'index.js' in the config directory
4. Open 'index.js' file and paste the following, save and close the file:

```
const NODE_ENV = process.env.NODE_ENV || 'dev';

const config = {
  dev: {
      DB_URL: `mongodb://localhost:27017/NC_news`
  },
  test: {
      DB_URL: `mongodb://localhost:27017/test_NC_news`
  }
}

module.exports = config[NODE_ENV]
```

5. Open a new window and run the following command:

```
mongod
```

## Running the tests

To run the tests run the following command in terminal:

```
npm test
```

### Tests

The test file tests for the following:

1. Positive testing of all endpoints
2. Negative testing of all end points - tests for 400, 404 and 500 errors

These are all the end points:

- GET /api
- GET /api/topics
- GET /api/topics/:topic_slug/articles
- POST /api/topics/:topic_slug/articles
- GET /api/articles
- GET /api/articles/:article_id
- GET /api/articles/:article_id/comments
- POST /api/articles/:article_id/comments
- PUT /api/articles/:article_id?vote=up/down
- PUT /api/comments/:comment_id?vote=up/down
- DELETE /api/comments/:comment_id
- GET /api/users/:username

## Seeding Dev Database
To seed local dev database run the following command in the terminal:

```
npm run seed:dev
```
If seeding is successful no errors should be returned and a message is returned to say that database has been seeded successfully.

## Deployed App

Deployed app: [NC News](https://northcoders-news-prod.herokuapp.com/api)

## Built With

* [NPM](https://docs.npmjs.com) - JavaScript package manager
* [Express](http://expressjs.com/en/4x/api.html) - Web Application Framework

