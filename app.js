const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
const mongoose = require('mongoose');
const {DB_URL} = require('./config/index');

mongoose.connect(DB_URL)
    .then(() => {
        console.log(`Connected to ${DB_URL}`);
    })
    .catch(console.log);

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use('/*', (req, res, next) => {
    next({status: 404, message: 'Page not found'});
});

app.use((err, req, res, next) => {
    if (err.status) res.status(err.status).send({message: err.message});
    else if (err.name === 'CastError') res.status(400).send({message: `Bad request! ${err.value} is not a valid ID`});
    else if (err.name === 'ValidationError') res.status(400).send({message: `Bad request! ${err.errors.created_by.message}`});
    else res.status(500).send({message: 'Woops! We messed something up on our server'});
});

module.exports = app;
