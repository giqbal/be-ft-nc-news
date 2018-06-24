const apiRouter = require('express').Router();
const {topicsRouter, articlesRouter, commentsRouter, usersRouter} = require('./index');

apiRouter.route('/')
    .get((req, res, next) => {
        res.render('pages/index');
    });

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;