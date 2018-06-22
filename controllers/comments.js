const {Comment} = require('../models/index');

const updateCommentVote = (req, res, next) => {
    const {comment_id} = req.params;
    const {vote} = req.query;
    let registerVote = 0;
    if (vote === 'up') registerVote = 1;
    else if (vote === 'down') registerVote = -1;
    else next({status: 400, message: 'Bad request'});
    Comment.findByIdAndUpdate(comment_id, {$inc: {votes: registerVote}}, {new: true})
        .populate('created_by', 'username -_id')
        .lean()
        .then(comment => {
            const {created_by: {username}} = comment;
            comment.created_by = username;
            res.send({comment});
        })
        .catch(next)
}

module.exports = {updateCommentVote};