const jwt = require("jsonwebtoken");
const { checkPlan } = require("../models/dev/subscribe");
const { checkApiKey } = require("./utils");
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

const checkApiKeyDev = async (req, res, next) => {
    if(!req.header("API-KEY")){
        return res.status(401).send({error: "Unauthorized User"});
    }

    try{
        let check = await checkApiKey(req.header('API-KEY'));
        if(check.code == 404){
            return res.status(404).send({error: check.msg});
        }

        if(check.code == 400){
            return res.status(400).send({error: check.msg})
        }
        
        req.body.user = check;
        next();
    }catch(ex){
        return res.status(400).send({error: "Ada yang salah"});
    }
}

module.exports = {checkAuthUser, checkAuthArtikelUser, checkApiKeyDev};


