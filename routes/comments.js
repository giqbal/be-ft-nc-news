const commentsRouter = require('express').Router();
const {updateCommentVote} = require('../controllers/comments')

commentsRouter.route('/:comment_id')
    .put(updateCommentVote);

module.exports = commentsRouter;