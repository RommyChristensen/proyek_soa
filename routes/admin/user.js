const express = require("express");
const user_model = require('../../models/admin/users');
const { ifExists } = require("../../helpers/utils");
const router = express.Router();

router.get('/', async (req, res) => {
    const result = await user_model.getData();
    return res.status(200).send(result);
});

router.get('/:user_id', async (req, res) => {
    if(! await ifExists("users", "user_id", req.params.user_id)){
        return res.status(404).send({error: "user not found"});
    }
    const result = await user_model.getDataById(req.params.user_id);
    return res.status(200).send(result);
});

module.exports = router;