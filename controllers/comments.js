const {Comment} = require('../models/index');
const {updateVote} = require('../utils');

const updateCommentVote = (req, res, next) => {
    const {comment_id} = req.params;
    const {vote} = req.query;
    updateVote(vote, comment_id, Comment, next)
        .then(comment => {
            if (comment === null) next({status: 404, message: `Page not found for id: ${comment_id}`})
            else {
                const {created_by: {username}} = comment;
                comment.created_by = username;
                res.send({comment});
            }
        })
        .catch(next);
}

const removeComment = (req, res, next) => {
    const {comment_id} = req.params;
    Comment.findByIdAndRemove(comment_id)
        .then((comment) => {
            if (comment === null) next({status: 404, message: `Page not found for id: ${comment_id}`});
            else res.status(204).send({});
        })
        .catch(next);
}

module.exports = {updateCommentVote, removeComment};