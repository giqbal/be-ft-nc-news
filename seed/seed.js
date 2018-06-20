const {User, Topic, Article, Comment} = require('../models/index');
const {formatArticleData, formatCommentData, createUserLookUp, createArticleLookup} = require('../utils/index');
const mongoose = require('mongoose');

const seedDB = ({userData, topicData, articleData, commentData}) => {
    return mongoose.connection.dropDatabase()
        .then(() => {
            Topic.insertMany(topicData);
            return User.insertMany(userData);
        })
        .then(userDocs => {
            return Promise.all([
                userDocs,
                Article.insertMany(formatArticleData(articleData, createUserLookUp(articleData, userDocs)))
            ]);
        })
        .then(([userDocs, articleDocs]) => {
            return Comment.insertMany(formatCommentData(commentData, createUserLookUp(articleData, userDocs), createArticleLookup(commentData, articleDocs)));
        })
        .catch(console.log);
}

module.exports = seedDB; 