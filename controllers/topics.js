const {Topic, Article, Comment} = require('../models/index');

const getTopics = (req, res, next) => {
    Topic.find()
        .then(topics => {
            res.send({topics})
        })
}

const getArticlesBySlug = (req, res, next) => {
    const {topic_slug} = req.params;
    Article.find({belongs_to: topic_slug})
        .populate({path: 'created_by', select: 'username -_id'})
        .then(articles => {
            const queryPromiseArr = articles.map(article => Comment.count({belongs_to: article._id}));
            queryPromiseArr.push(articles);
            return Promise.all(queryPromiseArr);
        })
        .then((promiseArr) => {
            const rawArticles = promiseArr.pop()
            const articles = promiseArr.map((commentCount, index) => {
                const {_id, title, body, created_by, belongs_to, votes, __v} = rawArticles[index];
                return {_id, title, body, created_by: created_by.username, belongs_to, votes, __v, comments: commentCount};
            });
            res.send({articles});
        })
        .catch(next);
}

module.exports = {getTopics, getArticlesBySlug}