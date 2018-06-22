const commentsRouter = require('express').Router();
const {updateCommentVote, removeComment} = require('../controllers/comments')

commentsRouter.route('/:comment_id')
    .put(updateCommentVote)
    .delete(removeComment);

module.exports = commentsRouter;