const {Article, Comment} = require('../models/index');
const {updateVote} = require('../utils');

const getArticles = (req, res, next) => {
    Article.find()
        .populate('created_by', 'username -_id')
        .lean()
        .then(unformattedArticles => {
            const promiseArrQuery = unformattedArticles.map(unformattedArticle => {
                return Comment.count({belongs_to: unformattedArticle._id});
            });
            promiseArrQuery.unshift(unformattedArticles);
            return Promise.all(promiseArrQuery);
        })
        .then(([unformattedArticles, ...commentCountsArr]) => {
            articles = commentCountsArr.map((commentCount, index) => {
                const {created_by} = unformattedArticles[index];
                return {...unformattedArticles[index], created_by: created_by.username, comments: commentCount};
            });
            res.send({articles});
        })
        .catch(next);
}

const getArticle = (req, res, next) => {
    const {article_id} = req.params;
    Article.findById(article_id)
        .populate('created_by', 'username -_id')
        .lean()
        .then(unformattedArticle => {
            if (unformattedArticle === null) next({status: 404, message: `Page not found for id: ${article_id}`});
            else return Promise.all([unformattedArticle, Comment.count({belongs_to: unformattedArticle._id})]);
        })
        .then(([unformattedArticle, comments]) => {
            const {created_by} = unformattedArticle;
            const article = {...unformattedArticle, created_by: created_by.username, comments};
            res.send({article});
        })
        .catch(next);
}

const getCommentsByArticle = (req, res, next) => {
    const {article_id} = req.params;
    Comment.find({belongs_to: article_id})
        .populate('created_by', 'username -_id')
        .lean()
        .then(unformattedComments => {
            const comments = unformattedComments.map(unformattedComment => {
                const {created_by} = unformattedComment;
                return {...unformattedComment, created_by: created_by.username};
            })
            res.send({comments});
        })
        .catch(next);
}

const addCommentByArticle = (req, res, next) => {
    const {article_id} = req.params;
    Article.findById(article_id).count()
        .then(articleCount => {
            if (articleCount === 0) next({status: 404, message: `Page not found for id: ${article_id}`});
            const newComment = new Comment({...req.body, belongs_to: article_id});
            return newComment.save()
        })
        .then(comment => {
            res.status(201).send({comment});
        })
        .catch(next);
}

const updateArticleVote = (req, res, next) => {
    const {article_id} = req.params;
    const {vote} = req.query;
    updateVote(vote, article_id, Article, next)
        .then(article => {
            const {created_by: {username}} = article;
            article.created_by = username;
            res.send({article});
        })
        .catch(next);
}

module.exports = {getArticles, getArticle, getCommentsByArticle, addCommentByArticle, updateArticleVote}