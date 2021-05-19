const express = require('express');
// const utils = require("../../helpers/user_utils");
const headline_model = require('../../models/dev/headline');
const middlewares = require('../../helpers/middlewares');
const router = express.Router();

router.get('/:country_code?/:limit?', middlewares.checkApiKeyDev, async (req, res) => {
    let result;
    if(req.params.country_code && req.params.limit){
        result = await headline_model.getDataHeadlines(req.params.limit, req.params.country_code);
    }else if(req.params.country_code){
        result = await headline_model.getDataHeadlines(null, req.params.country_code);
    }else{
        result = await headline_model.getDataHeadlines(req.params.limit);
    }

    if(!result){
        return res.status(500).send({error: "Ada yang salah"});
    }

    return res.status(200).send(result);
})

module.exports = router;

