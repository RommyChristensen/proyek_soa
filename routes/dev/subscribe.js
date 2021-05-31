const express = require("express");
const utils = require("../../helpers/utils");
const middleware = require('../../helpers/middlewares')
const subscribe_model = require('../../models/dev/subscribe');
const router = express.Router();

router.post('/', middleware.checkAuthUser, async(req, res) => {
    let { user, plan_id } = req.body;
    let checkPlan = await subscribe_model.checkPlan(plan_id, user.user_id);
    if(checkPlan != 200){
        let msg;
        if(checkPlan == 409) msg = "Sudah terdaftar";
        if(checkPlan == 500) msg = "Ada yang salah";
        if(checkPlan == 404) msg = "Plan tidak tersedia";
        return res.status(checkPlan).send({error: msg});
    }

    let result = await subscribe_model.insertData(user.user_id, plan_id);
    if(!result) return res.status(400).send({error: "Ada yang salah"});
    return res.status(200).send({
        subscribe_id: result,
        status: 'waiting for payment'
    });
});

module.exports = router;