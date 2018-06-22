const {User} = require('../models/index');

const getUser = (req, res, next) => {
    const {username} = req.params;
    User.findOne({username})
        .then(user => {
            if (user === null) next({status: 404, message:`Page not found for id: ${username}`});
            else res.send({user});
        })
        .catch(next);
}

module.exports = {getUser}