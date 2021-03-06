const express = require("express");
const artikel_model = require('../../models/admin/artikels');
const { ifExists,generateId } = require("../../helpers/utils");
const middleware = require('../../helpers/middlewares');
const router = express.Router();

router.get('/',middleware.checkAuthAdmin, async (req, res) => {
    const result = await artikel_model.getData();
    return res.status(200).send(result);
});
router.get('/:artikel_id',middleware.checkAuthAdmin, async (req, res) => {
    if(! await ifExists("artikels", "artikel_id", req.params.artikel_id)){
        return res.status(404).send({error: "Artikel not found"});
    }
    const result = await artikel_model.getDataById(req.params.artikel_id);
    return res.status(200).send(result);
});

module.exports = router;