const express = require("express");
const plan_model = require('../../models/dev/plan');
const { ifExists } = require("../../helpers/utils");
const middleware = require('../../helpers/middlewares');
const router = express.Router();

router.get('/:plan_id', async (req, res) => {
    const plan_id = req.params.plan_id;


    if(! await ifExists("plans", "plan_id", plan_id)){
        return res.status(404).send({error: "Plan not found"});
    }

    const result = await plan_model.getDataById(plan_id);
    return res.status(200).send(result);

});

module.exports = router;