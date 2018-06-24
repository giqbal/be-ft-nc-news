const handle404 = (err, req, res, next) => {
    if (err.status) res.status(err.status).send({message: err.message});
    else next(err);
}

const handle400 = (err, req, res, next) => {
    if (err.name === 'CastError') res.status(400).send({message: `Bad request! ${err.value} is not a valid ID`});
    else if (err.name === 'ValidationError') res.status(400).send({message: `Bad request! ${err.message}`});
    else next(err);
}

module.exports = {handle400, handle404}