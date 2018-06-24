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
        .lean()
        .then(articles => {
            const queryPromiseArr = articles.map(article => Comment.count({belongs_to: article._id}));
            queryPromiseArr.push(articles);
            return Promise.all(queryPromiseArr);
        })
        .then((promiseArr) => {
            const rawArticles = promiseArr.pop()
            if (rawArticles.length === 0) next({status: 404, message: `Page not found for topic: ${topic_slug}`});
            else {
                const articles = promiseArr.map((commentCount, index) => {
                    const {created_by} = rawArticles[index];
                    return {...rawArticles[index], created_by: created_by.username, comments: commentCount};
                });
                res.send({articles});
            }
        })
        .catch(next);
}

const addArticleBySlug = (req, res, next) => {
     const {topic_slug} = req.params;
     Topic.findOne({slug: topic_slug})
        .then(topic => {
            if (topic === null) next({status: 404, message: `Page not found for slug: ${topic_slug}`});
            const newArticle = new Article({...req.body, belongs_to: topic_slug});
            return newArticle.save();
        })
        .then(article => {
            res.status(201).send({article});
        })
        .catch(next);
}

module.exports = {getTopics, getArticlesBySlug, addArticleBySlug}