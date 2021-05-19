const express = require("express");
const share_model = require('../../models/dev/share');
const { ifExists } = require("../../helpers/utils");
const middleware = require('../../helpers/middlewares');
const router = express.Router();

router.post('/fb',middleware.checkApiKeyDev, async (req, res) => {

    const access_token = req.body.access_token;
    const app_id = req.body.app_id;
    const artikel_id= req.body.artikel_id;

    if(!await ifExists("artikels", "artikel_id", artikel_id)){
        return res.status(400).send({error: "Artikel not found"});
    }

    var result = await share_model.shareFacebook(access_token,app_id,artikel_id);
    return res.status(200).send({message: "Success share fb"});
    
});

module.exports = router;