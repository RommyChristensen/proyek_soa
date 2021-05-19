const express = require("express");
const apikey_model = require('../../models/dev/apikey');
const { ifExists } = require("../../helpers/utils");
const middleware = require('../../helpers/middlewares');
const router = express.Router();

router.get('/:subscribe_id', async (req, res) => {
    const subscribe_id = req.params.subscribe_id;

    if(!await ifExists("subscribes", "subscribe_id", subscribe_id)){
        return res.status(400).send({error: "Subscribe not found"});
    }
    
    const result = await apikey_model.getDataById(subscribe_id);
    return res.status(200).send({api_key: result});

});

module.exports = router;