const express = require("express");
const plan_model = require('../../models/admin/plans');
const { ifExists } = require("../../helpers/utils");
const router = express.Router();

router.get('/subscriber/', async (req, res) => {
    const result = await plan_model.getSubscriber();
    return res.status(200).send(result);
});

router.get('/subscriber/:plan_id', async (req, res) => {
    if(! await ifExists("plans", "plan_id", req.params.plan_id)){
        return res.status(404).send({error: "plan not found"});
    }
    const result = await plan_model.getSubscriberById(req.params.plan_id);
    return res.status(200).send(result);
});

router.get('/', async (req, res) => {
    const result = await plan_model.getData();
    return res.status(200).send(result);
});

router.get('/:plan_id', async (req, res) => {
    if(! await ifExists("plans", "plan_id", req.params.plan_id)){
        return res.status(404).send({error: "plan not found"});
    }
    const result = await plan_model.getDataById(req.params.plan_id);
    return res.status(200).send(result[0]);
});

router.post('/', async (req, res) => {
    const nama = req.body.nama;
    const deskripsi = req.body.deskripsi;
    const harga = parseInt(req.body.harga);
    const api_hit = parseInt(req.body.hit);
    const data = {
        plan_nama : nama,
        plan_deskripsi : deskripsi,
        plan_harga : harga,
        plan_api_hit : api_hit
    };
    if(await ifExists("plans", "plan_nama", nama)){
        return res.status(400).send({error: "plan has been registered"});
    }
    const plan_id=await plan_model.insertData(data);
    if(plan_id!=null){
        let datareturn = {
            plan_id : plan_id,
            plan_nama : nama,
            plan_deskripsi : deskripsi,
            plan_harga : harga,
            plan_api_hit : api_hit
        };
        return res.status(201).send(datareturn);
    }else{
        return res.status(500).send({error: "Something went wrong"});
    }
});

router.put('/:plan_id', async (req, res) => {
    const { plan_id } = req.params;
    const deskripsi = req.body.deskripsi;
    const harga = parseInt(req.body.harga);
    const hit = parseInt(req.body.hit);
    if(! await ifExists("plans", "plan_id", plan_id)){
        return res.status(404).send({error: "plan not found"});
    }
    const result = await plan_model.updateData(plan_id, deskripsi,harga,hit);
    return res.status(200).send(result);
});


module.exports = router;