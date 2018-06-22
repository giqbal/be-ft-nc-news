const {Article, Comment} = require('../models/index')

const getArticles = (req, res, next) => {
    Article.find()
        .populate('created_by', 'username -_id')
        .lean()
        .then(unformattedArticles => {
            const promiseArrQuery = unformattedArticles.map(unformattedArticle => Comment.count({belongs_to: unformattedArticle._id}));
            promiseArrQuery.push(unformattedArticles);
            return Promise.all(promiseArrQuery);
        })
        .then(resolvedArr => {
            unformattedArticles = resolvedArr.pop()
            articles = resolvedArr.map((commentCount, index) => {
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
            return Promise.all([unformattedArticle, Comment.count({belongs_to: unformattedArticle._id})]);
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
    const newComment = new Comment({...req.body, belongs_to: article_id});
    newComment.save()
        .then(comment => {
            res.status(201).send({comment});
        })
        .catch(next);
}

const updateArticleVote = (req, res, next) => {
    const {article_id} = req.params;
    const {vote} = req.query;
    let updateVote;
    if (vote === 'up') updateVote = {$inc: {votes: 1}};
    else if (vote === 'down') updateVote = {$inc: {votes: -1}};
    else next({status: 400, message: 'Bad request'});
    Article.findByIdAndUpdate(article_id, updateVote, {new: true})
        .populate('created_by', 'username -_id')
        .lean()
        .then(article => {
            const {created_by: {username}} = article;
            article.created_by = username;
            res.send({article});
        })
        .catch(next);
    
}

module.exports = {getArticles, getArticle, getCommentsByArticle, addCommentByArticle, updateArticleVote}