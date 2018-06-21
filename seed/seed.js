const {User, Topic, Article, Comment} = require('../models/index');
const {formatArticleData, formatCommentData, createUserLookUp, createArticleLookup} = require('../utils/index');
const mongoose = require('mongoose');

const seedDB = ({userData, topicData, articleData, commentData}) => {
    return mongoose.connection.dropDatabase()
        .then(() => {
            return Promise.all([User.insertMany(userData), Topic.insertMany(topicData)]);
        })
        .then(([userDocs, topicDocs]) => {
            return Promise.all([
                userDocs,
                topicDocs,
                Article.insertMany(formatArticleData(articleData, createUserLookUp(articleData, userDocs)))
            ]);
        })
        .then(([userDocs, topicDocs, articleDocs]) => {
            return Promise.all([
                userDocs,
                topicDocs,
                articleDocs,
                Comment.insertMany(formatCommentData(commentData, createUserLookUp(articleData, userDocs), createArticleLookup(commentData, articleDocs)))
            ]);
        })
        .catch(console.log);
}

module.exports = seedDB; 