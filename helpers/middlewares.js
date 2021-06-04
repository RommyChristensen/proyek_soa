const jwt = require("jsonwebtoken");
const { checkPlan } = require("../models/dev/subscribe");
const { checkApiKey, checkApiKeyFB, checkApiKeyArtikel } = require("./utils");
require('dotenv').config()

const checkAuthAdmin = async (req, res, next) => {
    if (!req.header("secretAdmin")) {
        return res.status(401).send({ error: "Unauthorized User" });
    }

    var secretAdmin = req.header("secretAdmin");
    if(secretAdmin!=process.env.secretAdmin){
        return res.status(400).send({ error: "Invalid Signature" });
    }
    next();
}
const checkAuthUser = async (req, res, next) => {
    if (!req.header("X-AUTH-TOKEN")) {
        return res.status(401).send({ error: "Unauthorized User" });
    }

    try {
        const user = jwt.verify(req.header('X-AUTH-TOKEN'), process.env.secret);
        req.body.user = user;
        next();
    } catch (ex) {
        return res.status(400).send({ error: "Invalid Signature" });
    }
}

const checkAuthArtikelUser = async (req, res, next) => {
    if (!req.header("X-AUTH-TOKEN")) {
        req.body.user = 'unauthorized';
        next();
    }
    else {
        try {
            const user = jwt.verify(req.header('X-AUTH-TOKEN'), process.env.secret);
            req.body.user = user;
            next();
        } catch (ex) {
            req.body.user = 'invalid';
            next();
        }
    }
}

const checkApiKeyDev = async (req, res, next) => {
    if (!req.header("API-KEY")) {
        return res.status(401).send({ error: "Unauthorized User" });
    }

    try {
        let check = await checkApiKey(req.header('API-KEY'));
        if (check.code == 404) {
            return res.status(404).send({ error: check.msg });
        }

        if (check.code == 400) {
            return res.status(400).send({ error: check.msg })
        }

        req.body.user = check;
        next();
    } catch (ex) {
        return res.status(400).send({ error: "Ada yang salah" });
    }
}

const checkApiKeyDevFB = async (req, res, next) => {
    if (!req.header("API-KEY")) {
        return res.status(401).send({ error: "Unauthorized User" });
    }

    try {
        let check = await checkApiKeyFB(req.header('API-KEY'));
        if (check.code == 404) {
            return res.status(404).send({ error: check.msg });
        }

        if (check.code == 400) {
            return res.status(400).send({ error: check.msg })
        }

        req.body.user = check;
        next();
    } catch (ex) {
        return res.status(400).send({ error: "Ada yang salah" });
    }
}

const checkApiKeyDevArtikel = async (req, res, next) => {
    if (!req.header("API-KEY")) {
        req.body.user = 'unauthorized';
        next();
    }
    else {
        try {
            let check = await checkApiKeyArtikel(req.header('API-KEY'));
            if (check.code == 404) {
                req.body.user = 'notfound';
                next();
            }
            else if (check.code == 400) {
                req.body.user = 'notenough';
                next();
            }
            else {
                req.body.user = check['user'];
                next();
            }
        } catch (ex) {
            req.body.user = 'invalid';
            next();
        }
    }
}

module.exports = { checkAuthAdmin,checkAuthUser, checkAuthArtikelUser, checkApiKeyDev, checkApiKeyDevFB, checkApiKeyDevArtikel };


