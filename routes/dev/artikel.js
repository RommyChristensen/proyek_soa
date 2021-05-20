const fs = require('fs')
const express = require("express");
const multer  = require('multer');
const artikel_model = require('../../models/dev/artikels');
const hashtag_model = require('../../models/dev/hashtags');
const middleware = require('../../helpers/middlewares');
const { ifExists,generateId } = require("../../helpers/utils");
const router = express.Router();

function checkFileType(file,cb){
    const filetypes= /jpeg|jpg|png|gif/;
    const extname=filetypes.test(file.originalname.split('.')[file.originalname.split('.').length-1]);
    const mimetype=filetypes.test(file.mimetype);
    if(mimetype && extname){
        return cb(null,true);
    }else{
        cb(error = 'Error : Image Only!');
    }
}

var storage = multer.diskStorage({
    destination: async function(req,file,callback){
        callback(null,'./uploads')
    },
    filename: async function(req,file,callback){
        const filename = file.originalname.split(".");
        const extension = filename[filename.length - 1];
        let foto_id = await generateId("artikels", "artikel_id", "A");
        callback(null,`${foto_id}.${extension}`);
    }
});

var storageupd = multer.diskStorage({
    destination: async function(req,file,callback){
        callback(null,'./uploads')
    },
    filename: async function(req,file,callback){
        const filename = file.originalname.split(".");
        const extension = filename[filename.length - 1];
        let foto_id = req.params.artikel_id+"R";
        callback(null,`${foto_id}.${extension}`);
    }
});

var uploads=multer({
    storage:storage,
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
});

var uploadsupd=multer({
    storage:storageupd,
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
});

router.post('/',uploads.single('artikel_foto'),middleware.checkApiKeyDevArtikel, async (req, res) => {
    let kategori_id = req.body.kategori_id;
    let artikel_judul = req.body.artikel_judul;
    let artikel_isi = req.body.artikel_isi;
    let hashtag_namas = req.body.hashtag_nama;
    let hashtag=[];
    let foto_id = await generateId("artikels", "artikel_id", "A");
    let user_id='';
    if(!(req.body.user=='invalid' || req.body.user=='unauthorized' || req.body.user=='notfound' || req.body.user=='notenough')){
        user_id=req.body.user.user_id;
    }
    else{
        //user blm login atau token tidak sesuai 
        try{
            fs.unlinkSync(`./uploads/`+foto_id+".jpeg");
        }
        catch{}
        try{
            fs.unlinkSync(`./uploads/`+foto_id+".jpg");
        }
        catch{}
        try{
            fs.unlinkSync(`./uploads/`+foto_id+".png");
        }
        catch{}
        try{
            fs.unlinkSync(`./uploads/`+foto_id+".gif");
        }
        catch{}
        if(req.body.user=='unauthorized'){
            return res.status(401).send({error: "Unauthorized User"});
        }
        else if(req.body.user=='invalid'){
            return res.status(401).send({error: "Invalid Signature"});
        }
        if(req.body.user=='notfound'){
            return res.status(404).send({error: "API KEY Not Found"});
        }
        else if(req.body.user=='notenough'){
            return res.status(400).send({error: "Your API Hit is empty"});
        }
    }

    let myfile = req.file;
    let namafile =myfile.originalname.split(".");
    let ext = namafile[namafile.length - 1];

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
    
    if(!await ifExists("kategoris", "kategori_id", kategori_id)){
        try{
            fs.unlinkSync(`./uploads/`+foto_id+".jpeg");
        }
        catch{}
        try{
            fs.unlinkSync(`./uploads/`+foto_id+".jpg");
        }
        catch{}
        try{
            fs.unlinkSync(`./uploads/`+foto_id+".png");
        }
        catch{}
        try{
            fs.unlinkSync(`./uploads/`+foto_id+".gif");
        }
        catch{}
        return res.status(404).send({error: "Kategori not found"});
    }
    const data = {
        kategori_id:kategori_id,
        user_id:user_id,
        artikel_judul:artikel_judul,
        artikel_isi:artikel_isi,
        hashtag:hashtag,
        artikel_foto:foto_id+'.'+ext
    };
    const artikel_id=await artikel_model.insertData(data);
    if(artikel_id!=null){
        let datareturn = {
            artikel_id : artikel_id,
            artikel_judul : artikel_judul,
            artikel_isi : artikel_isi,
            artikel_tanggal : new Date().getDate()+"-"+(new Date().getMonth()+1)+"-"+new Date().getFullYear(),
            artikel_foto : foto_id+'.'+ext,
            hashtag_id : hashtag
        };
        return res.status(201).send(datareturn);
    }else{
        return res.status(500).send({error: "Something went wrong"});
    }
});

router.put('/:artikel_id',uploadsupd.single('artikel_foto'),middleware.checkApiKeyDevArtikel, async (req, res) => {
    let artikel_id = req.params.artikel_id;
    let foto_id = artikel_id;

    let kategori_id='';
    let artikel_judul='';
    let artikel_isi='';
    let artikel_foto='';

    let user_id='';
    if(!(req.body.user=='invalid' || req.body.user=='unauthorized' || req.body.user=='notfound' || req.body.user=='notenough')){
        user_id=req.body.user.user_id;
    }
    else{
        //user blm login atau token tidak sesuai 
        try{
            fs.unlinkSync(`./uploads/`+foto_id+".jpeg");
        }
        catch{}
        try{
            fs.unlinkSync(`./uploads/`+foto_id+".jpg");
        }
        catch{}
        try{
            fs.unlinkSync(`./uploads/`+foto_id+".png");
        }
        catch{}
        try{
            fs.unlinkSync(`./uploads/`+foto_id+".gif");
        }
        catch{}
        if(req.body.user=='unauthorized'){
            return res.status(401).send({error: "Unauthorized User"});
        }
        else if(req.body.user=='invalid'){
            return res.status(401).send({error: "Invalid Signature"});
        }
        if(req.body.user=='notfound'){
            return res.status(404).send({error: "API KEY Not Found"});
        }
        else if(req.body.user=='notenough'){
            return res.status(400).send({error: "Your API Hit is empty"});
        }
    }

    //cek artikel ada ga
    if(! await ifExists("artikels", "artikel_id", artikel_id)){
        try{
            fs.unlinkSync(`./uploads/`+foto_id+"R.jpeg");
        }
        catch{}
        try{
            fs.unlinkSync(`./uploads/`+foto_id+"R.jpg");
        }
        catch{}
        try{
            fs.unlinkSync(`./uploads/`+foto_id+"R.png");
        }
        catch{}
        try{
            fs.unlinkSync(`./uploads/`+foto_id+"R.gif");
        }
        catch{}
        return res.status(404).send({error: "Artikel not found"});
    }

    //cek artikel yg diedit apakah milik user yg login
    var take = await artikel_model.getDataById(artikel_id);
    var user_artikel = take[0].user_id;
    if(user_artikel!=user_id){
        try{
            fs.unlinkSync(`./uploads/`+foto_id+"R.jpeg");
        }
        catch{}
        try{
            fs.unlinkSync(`./uploads/`+foto_id+"R.jpg");
        }
        catch{}
        try{
            fs.unlinkSync(`./uploads/`+foto_id+"R.png");
        }
        catch{}
        try{
            fs.unlinkSync(`./uploads/`+foto_id+"R.gif");
        }
        catch{}
        return res.status(403).send({error: "Artikel isn't yours"});
    }

    //cek kategori apakah terdaftar
    kategori_id=req.body.kategori_id;
    if(kategori_id!=null && kategori_id!=''){
        if(!await ifExists("kategoris", "kategori_id", kategori_id)){
            try{
                fs.unlinkSync(`./uploads/`+foto_id+"R.jpeg");
            }
            catch{}
            try{
                fs.unlinkSync(`./uploads/`+foto_id+"R.jpg");
            }
            catch{}
            try{
                fs.unlinkSync(`./uploads/`+foto_id+"R.png");
            }
            catch{}
            try{
                fs.unlinkSync(`./uploads/`+foto_id+"R.gif");
            }
            catch{}
            return res.status(404).send({error: "Kategori not found"});
        }
    }

    //cek apakah dia masukin foto baru
    let myfile = req.file;
    if(myfile==null){
        try{
            fs.unlinkSync(`./uploads/`+foto_id+"R.jpeg");
        }
        catch{}
        try{
            fs.unlinkSync(`./uploads/`+foto_id+"R.jpg");
        }
        catch{}
        try{
            fs.unlinkSync(`./uploads/`+foto_id+"R.png");
        }
        catch{}
        try{
            fs.unlinkSync(`./uploads/`+foto_id+"R.gif");
        }
        catch{}
        artikel_foto='';
    }
    else{
        let namafile =myfile.originalname.split(".");
        let ext = namafile[namafile.length - 1];
        artikel_foto=artikel_id+"R."+ext;
    }

    artikel_judul = req.body.artikel_judul;
    artikel_isi   = req.body.artikel_isi;
    let data = {};
    if(kategori_id!='' && kategori_id!=null){
        data["kategori_id"] = kategori_id;
    }
    if(artikel_judul!='' && artikel_judul!=null){
        data["artikel_judul"] = artikel_judul;
    }
    if(artikel_isi!='' && artikel_isi!=null){
        data["artikel_isi"] = artikel_isi;
    }
    if(artikel_foto!='' && artikel_foto!=null){
        data["artikel_foto"] = artikel_foto;
    }
    
    let result = await artikel_model.updateData(artikel_id, data);

    if(!result){
        return res.status(500).send({error: "Something went wrong"});
    }

    return res.status(200).send(result);
});

module.exports = router;