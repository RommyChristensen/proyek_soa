const express = require("express");
const comments_model = require('../../models/user/comments');
const { ifExists } = require("../../helpers/utils");
const middleware = require('../../helpers/middlewares')
const router = express.Router();

router.get('/', async (req, res) => {

    //return res.status(200).send("test");

    if(! await ifExists("comments", "artikel_id", req.query.artikel_id)){
        return res.status(404).send({error: "Artikel not found"});
    }

    if(! await ifExists("comments", "user_id", req.query.user_id)){
        return res.status(404).send({error: "User not found"});
    }

    const result = await comments_model.getDataById(req.query.artikel_id,req.query.user_id);
    return res.status(200).send(result[0]);
});

router.post('/:artikel_id',middleware.checkAuthUser , async (req, res) => {
    const artikel_id = req.params.artikel_id;
    user_id = req.body.user.user_id
    const data = {
        comment_isi : req.body.isi,
        user_id : user_id,
        artikel_id : artikel_id
    };
  
    if(await ifExists("artikels", "artikel_id", artikel_id)){
        return res.status(400).send({error: "Artikel not found"});
    }

    const comment_id = await comments_model.insertData(data);
    
    if(comment_id!=null){
        let datareturn = {
            comment_id : comment_id,
            user_id : user_id,
            comment_isi : comment_isi,
            comment_tanggal : comment_tanggal
        };
        return res.status(201).send(datareturn);
    }else{
        return res.status(500).send({error: "Something went wrong"});
    }
});


module.exports = router;