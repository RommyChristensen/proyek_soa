const express = require("express");
const likes_model = require('../../models/dev/likes');
const { ifExists } = require("../../helpers/utils");
const middleware = require('../../helpers/middlewares');
const router = express.Router();

router.post('/:artikel_id',middleware.checkApiKeyDev , async (req, res) => {
    const artikel_id = req.params.artikel_id;
    const user_id = req.body.user.user_id;
    
    if(!await ifExists("artikels", "artikel_id", artikel_id)){
        return res.status(400).send({error: "Artikel not found"});
    }

    if(!await likes_model.cekUser(user_id,artikel_id)){
        var result = await likes_model.likeArtikel(user_id,artikel_id);
        return res.status(200).send(result);
    }else{
        var result = await likes_model.unlikeArtikel(user_id,artikel_id);
        return res.status(200).send({message: "Success Unlike"});
    }

});

module.exports = router;