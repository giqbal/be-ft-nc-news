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

module.exports = {getArticles}