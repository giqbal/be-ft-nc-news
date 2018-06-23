const {Comment} = require('../models/index');

const updateCommentVote = (req, res, next) => {
    const {comment_id} = req.params;
    const {vote} = req.query;
    let registerVote = 0;
    if (vote === 'up') registerVote = 1;
    else if (vote === 'down') registerVote = -1;
    else next({status: 400, message: 'Bad request: Query must be vote=up or vote=down'});
    Comment.findByIdAndUpdate(comment_id, {$inc: {votes: registerVote}}, {new: true})
        .populate('created_by', 'username -_id')
        .lean()
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