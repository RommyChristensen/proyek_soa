const express = require('express');
// const utils = require("../../helpers/user_utils");
const auth_model = require('../../models/user/auth');
const router = express.Router();

router.post("/register", async (req, res) => {
    let { username, password, confirm_password, email, tanggal_lahir, nama } = req.body;

    if(! await auth_model.checkUnique("users", "user_username", username)){
        return res.status(400).send({error: "Username not unique"});
    }

    if(! await auth_model.checkUnique("users", "user_email", email)){
        return res.status(400).send({error: "Email not unique"});
    }

    if(password !== confirm_password){
        return res.status(400).send({error: "Password not match"});
    }

    const data = {
        user_username: username,
        user_password: password,
        user_email: email,
        user_tanggal_lahir: tanggal_lahir,
        user_nama: nama    
    };

    if(await auth_model.insert("users", data)){
        return res.status(201).send(data);
    }else{
        return res.status(500).send({error: "Something went wrong"});
    }
});

module.exports = router;

