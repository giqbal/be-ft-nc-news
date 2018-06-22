const articlesRouter = require('express').Router();
const {getArticles, getArticle, getCommentsByArticle, addCommentByArticle} = require('../controllers/articles');

articlesRouter.route('/')
    .get(getArticles);

articlesRouter.route('/:article_id')
    .get(getArticle);

articlesRouter.route('/:article_id/comments')
    .get(getCommentsByArticle)
    .post(addCommentByArticle);

module.exports = articlesRouter;