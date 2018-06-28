const formatArticleData = (articleData, userLookUp) => {
    return articleData.map(articleDatum => {
        const {topic: belongs_to, created_by} = articleDatum;
        return {...articleDatum, belongs_to, created_by: userLookUp[created_by]};
    });
}

const formatCommentData = (commentData, userLookUp, articleLookUp) => {
    return commentData.map(commentDatum => {
        const {belongs_to, created_by} = commentDatum;
        return {...commentDatum, created_by: userLookUp[created_by], belongs_to: articleLookUp[belongs_to]};
    });
}

const createUserLookUp = (articleData, userDocs) => {
    return articleData.reduce((acc, {created_by}) => {
        acc[created_by] = userDocs.find(userDoc => userDoc.username === created_by)._id;
        return acc;
    }, {});
}

const createArticleLookup = (commentData, articleDocs) => {
    return commentData.reduce((acc, {belongs_to}) => {
        acc[belongs_to] = articleDocs.find(articleDoc => articleDoc.title === belongs_to)._id;
        return acc;
    }, {});
}

const updateVote = (voteQuery, collectionID, collectionToUpdate,  next) => {
    let registerVote = 0;
    if (voteQuery === 'up') registerVote = 1;
    else if (voteQuery === 'down') registerVote = -1;
    else next({status: 400, message: 'Bad request: Query must be vote=up or vote=down'});
    return collectionToUpdate.findByIdAndUpdate(collectionID, {$inc: {votes: registerVote}}, {new: true})
        .populate('created_by', 'username -_id')
        .lean()
}

module.exports = {formatArticleData, formatCommentData, createUserLookUp, createArticleLookup, updateVote}