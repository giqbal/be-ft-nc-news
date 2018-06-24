# Northcoders News

Northcoders News is a reddit style news app for Northcoder internal news. Articles and comments can be posted by users. App users can also upvote or downvote articles and comments.

## Prerequisites

Ensure you have NodeJS and MongoDB installed on your machine

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
- PUT /api/articles/:article_id?vote=up
- PUT /api/comments/:comment_id?vote=up
- DELETE /api/comments/:comment_id
- GET /api/users/:username


## Deployed App

Deployed app: [NC News](https://northcoders-news-prod.herokuapp.com/api)

## Built With

* [NPM](https://docs.npmjs.com) - JavaScript package manager
* [Express](http://expressjs.com/en/4x/api.html) - Web Application Framework

