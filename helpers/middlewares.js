const jwt = require("jsonwebtoken");
require('dotenv').config()

const checkAuthUser = async (req, res, next) => {
    if(!req.header("X-AUTH-TOKEN")){
        return res.status(401).send({error: "Unauthorized User"});
    }

    const user = jwt.verify(req.header('X-AUTH-TOKEN'), process.env.secret);
    req.body.user = user;
    next();
}

module.exports = {checkAuthUser};


