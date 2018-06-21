const topicsRouter = require('express').Router();
const {getTopics, getArticlesBySlug} = require('../controllers/topics');

topicsRouter.route('/')
    .get(getTopics);

topicsRouter.route('/:topic_slug/articles')
    .get(getArticlesBySlug);

module.exports = topicsRouter;