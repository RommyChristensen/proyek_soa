const express = require("express");
const comments_model = require('../../models/user/comments');
const hashtag_model = require('../../models/user/hashtags');
const { ifExists } = require("../../helpers/utils");
const middleware = require('../../helpers/middlewares');
const router = express.Router();

router.get('/',middleware.checkAuthUser, async (req, res) => {
    const user_id = req.body.user.user_id;

    if(! await ifExists("comments", "artikel_id", req.query.artikel_id)){
        return res.status(404).send({error: "Artikel not found"});
    }

    const result = await comments_model.getDataById(req.query.artikel_id);
    return res.status(200).send(result);
});

router.post('/:artikel_id',middleware.checkAuthUser , async (req, res) => {
    const artikel_id = req.params.artikel_id;
    const user_id = req.body.user.user_id;
    let hashtag_namas = req.body.hashtag_nama;
    let hashtag=[];

    if(hashtag_namas){
        for(let i=0;i<hashtag_namas.length;i++){
            if(await ifExists("hashtags", "hashtag_nama", hashtag_namas[i])){ //uda ada
                var take = await hashtag_model.getDataByNama(hashtag_namas[i]);
                var id = take[0].hashtag_id;
                hashtag.push(id);
            }
            else{
                const data = {
                    hashtag_nama : hashtag_namas[i]
                };
                const id_baru=await hashtag_model.insertData(data);
                hashtag.push(id_baru);
            }
        }
    }
    
    const data = {
        comment_isi : req.body.isi,
        user_id : user_id,
        artikel_id : artikel_id,
        hashtag:hashtag
    };
    
    if(!await ifExists("artikels", "artikel_id", artikel_id)){
        return res.status(400).send({error: "Artikel not found"});
    }

    const comment_id = await comments_model.insertData(data);  

    if(comment_id!=null){
        let datareturn = {
            comment_id : comment_id,
            user_id : user_id,
            comment_isi : req.body.isi
        };  
        return res.status(201).send(datareturn);
    }else{
        return res.status(500).send({error: "Something went wrong"});
    }

});

router.delete('/:comment_id',middleware.checkAuthUser, async (req, res) => {
    // return res.status(200).send({message : "Deleted"});
    const comment_id = req.params.comment_id;
    const user_id = req.body.user.user_id;

    if(!await ifExists("comments", "comment_id", comment_id)){
        return res.status(404).send({error: "Comment not found"});
    }
    
    if(!await comments_model.cekUser(comment_id,user_id)){
        return res.status(404).send({error: "The owner of the comment is not a logged-in user"});
    }

    var hasilDelete = await comments_model.deleteData(comment_id);
    if(hasilDelete){
        return res.status(200).send(hasilDelete[0]);
    }else{
        return res.status(500).send({error: "Something went wrong"});
    }

});


module.exports = router;