const topicsRouter = require('express').Router();
const {getTopics, getArticlesBySlug, addArticleBySlug} = require('../controllers/topics');

topicsRouter.route('/')
    .get(getTopics);

topicsRouter.route('/:topic_slug/articles')
    .get(getArticlesBySlug)
    .post(addArticleBySlug);

module.exports = topicsRouter;