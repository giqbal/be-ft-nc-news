const apiRouter = require('express').Router();
const {topicsRouter} = require('./index')

apiRouter.route('/')
    .get((req, res, next) => {
        res.send({message: 'Welcome to NC News!'});
    });

apiRouter.use('/topics', topicsRouter);

module.exports = apiRouter;