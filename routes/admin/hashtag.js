const express = require("express");
const hashtag_model = require('../../models/admin/hashtags');
const { ifExists } = require("../../helpers/utils");
const router = express.Router();

router.get('/', async (req, res) => {
    const result = await hashtag_model.getData();
    return res.status(200).send(result);
});

router.get('/:hashtag_id', async (req, res) => {
    if(! await ifExists("hashtags", "hashtag_id", req.params.hashtag_id)){
        return res.status(404).send({error: "Hashtag not found"});
    }
    const result = await hashtag_model.getDataById(req.params.hashtag_id);
    return res.status(200).send(result[0]);
});

router.post('/', async (req, res) => {
    const { nama } = req.body;
    const data = {
        hashtag_nama : nama
    };
    if(await ifExists("hashtags", "hashtag_nama", nama)){
        return res.status(400).send({error: "Hashtag has been registered"});
    }
    const hashtag_id=await hashtag_model.insertData(data);
    if(hashtag_id!=null){
        let datareturn = {
            hashtag_id : hashtag_id,
            hashtag_nama : nama
        };
        return res.status(201).send(datareturn);
    }else{
        return res.status(500).send({error: "Something went wrong"});
    }
});

router.put('/:hashtag_id', async (req, res) => {
    const { hashtag_id } = req.params;
    const { nama } = req.body;
    if(! await ifExists("hashtags", "hashtag_id", hashtag_id)){
        return res.status(404).send({error: "Hashtag not found"});
    }
    if(await ifExists("hashtags", "hashtag_nama", nama)){
        return res.status(404).send({error: "Hashtag can't be changed by that new name because it's used already"});
    }
    const result = await hashtag_model.updateData(hashtag_id, nama);
    return res.status(200).send(result);
});

router.delete('/:hashtag_id', async (req, res) => {
    const { hashtag_id } = req.params;
    if(! await ifExists("hashtags", "hashtag_id", hashtag_id)){
        return res.status(404).send({error: "Hashtag not found"});
    }
    if(await ifExists("hashtag_artikel", "hashtag_id", hashtag_id)){
        return res.status(404).send({error: "Hashtag can't be deleted because it is used in some artikels"});
    }
    if(await ifExists("hashtag_comment", "hashtag_id", hashtag_id)){
        return res.status(404).send({error: "Hashtag can't be deleted because it is used in some comments"});
    }

    if(await hashtag_model.deleteData(hashtag_id)){
        return res.status(200).send({message : "Deleted"});
    }else{
        return res.status(500).send({error: "Something went wrong"});
    }
});

module.exports = router;