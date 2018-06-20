const {Topic} = require('../models/index');

const getTopics = (req, res, next) => {
    Topic.find()
        .then(topics => {
            res.send({topics})
        })
}

module.exports = {getTopics}