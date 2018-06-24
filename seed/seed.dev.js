const testData = require('./devData/index');
const mongoose = require('mongoose');
const seedDB = require('./seed');
const DB_URL = require('../config');

mongoose.connect(DB_URL)
    .then(() => {
        console.log(`Connected to ${DB_URL}`);
    })
    .then(() => {
        return seedDB(testData);
    })
    .then(() => {
        console.log(`${DB_URL} successfully seeded with test data`);
        return mongoose.disconnect();
    })
    .catch(console.log);
