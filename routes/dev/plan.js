const express = require("express");
const plan_model = require('../../models/dev/plan');
const { ifExists } = require("../../helpers/utils");
const middleware = require('../../helpers/middlewares');
const router = express.Router();

router.get('/', async (req, res) => {
    const result = await plan_model.getAllData();
    return res.status(200).send(result);
});

router.get('/:plan_id', async (req, res) => {
    const plan_id = req.params.plan_id;

    const result = await plan_model.getDataById(plan_id);
    return res.status(200).send(result[0]);
});

module.exports = router;