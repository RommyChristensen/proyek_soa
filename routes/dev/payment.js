const express = require("express");
const utils = require("../../helpers/utils");
const middleware = require('../../helpers/middlewares')
const payment_model = require('../../models/dev/payment');
const router = express.Router();

router.post('/bank', middleware.checkAuthUser, async (req, res) => {
    let { subscribe_id, user } = req.body;
    let checkSubscription = await payment_model.checkSubscription(subscribe_id);
    if(checkSubscription == 409 || checkSubscription == 500 || checkSubscription == 404){
        let msg;
        if(checkPlan == 409) msg = "Sudah terdaftar";
        if(checkPlan == 500) msg = "Ada yang salah";
        if(checkPlan == 404) msg = "Subscribe tidak tersedia";
        return res.status(checkPlan).send({error: msg});
    }

    let response = await payment_model.requestPaymentBT(checkSubscription);
    return res.status(200).send(response.va_numbers);
});

router.post('/cc', middleware.checkAuthUser, async (req, res) => {

});

router.post('/payment_notification', async (req, res) => {
    let result;
    if(req.body.payment_type == "bank_transfer"){
        result = await payment_model.completePaymentBT(req.body.order_id, req.body.transaction_status);
    }
    console.log(result);
    return res.send(result);
});

module.exports = router;