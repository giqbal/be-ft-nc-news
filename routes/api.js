const apiRouter = require('express').Router();
const {topicsRouter, articlesRouter, commentsRouter, usersRouter} = require('./index');

apiRouter.route('/')
    .get((req, res, next) => {
        res.send({message: 'Welcome to NC News!'});
    });

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;