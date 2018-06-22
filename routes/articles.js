const articlesRouter = require('express').Router();
const {getArticles, getArticle, getCommentsByArticle, addCommentByArticle, updateArticleVote} = require('../controllers/articles');

articlesRouter.route('/')
    .get(getArticles);

articlesRouter.route('/:article_id')
    .get(getArticle)
    .put(updateArticleVote);

articlesRouter.route('/:article_id/comments')
    .get(getCommentsByArticle)
    .post(addCommentByArticle);

module.exports = articlesRouter;