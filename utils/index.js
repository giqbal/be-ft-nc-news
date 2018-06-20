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

module.exports = {formatArticleData, formatCommentData, createUserLookUp, createArticleLookup}