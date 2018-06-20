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
    res.status(404).send({message: 'Page not found'});
});

app.use((err, req, res, next) => {
    if (err.status) res.status(err.status).send(err.message);
    else res.status(500).send({message: 'Woops! We messed something up on our server'});
});

module.exports = app;
