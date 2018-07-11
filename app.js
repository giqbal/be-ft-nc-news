const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
const mongoose = require('mongoose');
const cors = require('cors');
const {DB_URL} = process.env.NODE_ENV === 'production'? process.env : require('./config');
const {handle400, handle404} = require('./errors');

mongoose.connect(DB_URL)
    .then(() => {
        console.log(`Connected to ${DB_URL}`);
    })
    .catch(console.log);

app.use(cors());

app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use('/api', apiRouter);

app.use('/*', (req, res, next) => {
    next({status: 404, message: 'Page not found'});
});

app.use(handle404);

app.use(handle400);

app.use((err, req, res, next) => {
    res.status(500).send({message: 'Woops! We messed something up on our server'});
});

module.exports = app;
