const express = require("express");
const kategori_model = require('../../models/admin/kategoris');
const { ifExists } = require("../../helpers/utils");
const router = express.Router();

router.get('/', async (req, res) => {
    const result = await kategori_model.getData();
    return res.status(200).send(result);
});

router.get('/:kategori_id', async (req, res) => {
    if(! await ifExists("kategoris", "kategori_id", req.params.kategori_id)){
        return res.status(404).send({error: "Kategori not found"});
    }

    const result = await kategori_model.getDataById(req.params.kategori_id);
    return res.status(200).send(result[0]);
});

router.post('/', async (req, res) => {
    const { nama } = req.body;
    const data = {
        kategori_nama : nama
    };

    if(await ifExists("kategoris", "kategori_nama", nama)){
        return res.status(500).send({error: "Duplicate names"});
    }

    var kategori_id = await kategori_model.insertData(data);
    if(kategori_id!=false){
        var datareturn={
            "kategori_id":kategori_id,
            "kategori_nama":nama
        }
        return res.status(201).send(datareturn);
    }
    else{
        return res.status(500).send({error: "Something went wrong"});
    }
});

router.put('/:kategori_id', async (req, res) => {
    const { kategori_id } = req.params;
    const { nama } = req.body;
    if(! await ifExists("kategoris", "kategori_id", kategori_id)){
        return res.status(404).send({error: "Kategori not found"});
    }

    if(await ifExists("kategoris", "kategori_nama", nama)){
        return res.status(500).send({error: "Duplicate names"});
    }

    const result = await kategori_model.updateData(kategori_id, nama);
    return res.status(200).send(result);
});

router.delete('/:kategori_id', async (req, res) => {
    const { kategori_id } = req.params;
    if(! await ifExists("kategoris", "kategori_id", kategori_id)){
        return res.status(404).send({error: "Kategori not found"});
    }

    if( await ifExists("artikels", "kategori_id", kategori_id)){
        return res.status(500).send({error: "Kategori used by some articles"});
    }

    if(await kategori_model.deleteData(kategori_id)){
        return res.status(200).send({message : "Deleted"});
    }else{
        return res.status(500).send({error: "Something went wrong"});
    }
});

module.exports = router;