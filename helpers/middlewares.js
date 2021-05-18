const jwt = require("jsonwebtoken");
require('dotenv').config()

const checkAuthUser = async (req, res, next) => {
    if(!req.header("X-AUTH-TOKEN")){
        return res.status(401).send({error: "Unauthorized User"});
    }

    try{
        const user = jwt.verify(req.header('X-AUTH-TOKEN'), process.env.secret);
        req.body.user = user;
        next();
    }catch(ex){
        return res.status(400).send({error: "Invalid Signature"});
    }
    
}

const checkAuthArtikelUser = async (req, res, next) => {
    if(!req.header("X-AUTH-TOKEN")){
        return res.status(401).send({error: "Unauthorized User"});
    }

    try{
        const user = jwt.verify(req.header('X-AUTH-TOKEN'), process.env.secret);
        req.body.user = user;
        next();
    }catch(ex){
        req.body.user = 'invalid';
        next();
    }
    
}

module.exports = {checkAuthUser,checkAuthArtikelUser};


