const apiRouter = require('express').Router();
const {topicsRouter, articlesRouter} = require('./index');

apiRouter.route('/')
    .get((req, res, next) => {
        res.send({message: 'Welcome to NC News!'});
    });

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);

module.exports = apiRouter;