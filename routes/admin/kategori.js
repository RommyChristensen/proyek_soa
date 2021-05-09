const express = require("express");
const kategori_model = require('../../models/admin/kategoris');
const router = express.Router();

router.get('/', async (req, res) => {
    const result = await kategori_model.getData();
    return res.status(200).send(result);
});

router.get('/:kategori_id', async (req, res) => {
    if(! await kategori_model.ifExists("kategoris", "kategori_id", kategori_id)){
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

    if(await kategori_model.ifExists("kategoris", "kategori_nama", nama)){
        return res.status(500).send({error: "Duplicate names"});
    }

    if(await kategori_model.insertData(data)){
        return res.status(201).send(data);
    }else{
        return res.status(500).send({error: "Something went wrong"});
    }
});

router.put('/:kategori_id', async (req, res) => {
    const { kategori_id } = req.params;
    const { nama } = req.body;
    if(! await kategori_model.ifExists("kategoris", "kategori_id", kategori_id)){
        return res.status(404).send({error: "Kategori not found"});
    }

    if(await kategori_model.ifExists("kategoris", "kategori_nama", nama)){
        return res.status(500).send({error: "Duplicate names"});
    }

    const result = await kategori_model.updateData(kategori_id, nama);
    return res.status(200).send(result);
});

router.delete('/:kategori_id', async (req, res) => {
    const { kategori_id } = req.params;
    if(! await kategori_model.ifExists("kategoris", "kategori_id", kategori_id)){
        return res.status(404).send({error: "Kategori not found"});
    }

    if( await kategori_model.ifExists("artikels", "kategori_id", kategori_id)){
        return res.status(500).send({error: "Kategori used by some articles"});
    }

    if(await kategori_model.deleteData(kategori_id)){
        return res.status(200).send({message : "Deleted"});
    }else{
        return res.status(500).send({error: "Something went wrong"});
    }
});

module.exports = router;