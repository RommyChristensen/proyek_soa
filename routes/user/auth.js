const express = require('express');
// const utils = require("../../helpers/user_utils");
const auth_model = require('../../models/user/auth');
const middlewares = require('../../helpers/middlewares');
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

router.post('/login', async (req, res) => {

    const { username, password } = req.body;
    const data = {
        user_username : username,
        user_password : password,
    }

    const user = await auth_model.checkUsernamePassword(data);

    if(!user){
        return res.status(404).send({error: "Username / Password Salah"});
    }

    return res.status(200).send({
        token: user
    });
})

router.put('/profile/:username', middlewares.checkAuthUser, async (req, res) => {
    const {user} = req.body;

    // nama, username
    let data = {}
    for (const [key, value] of Object.entries(req.body)) {
        if(key != 'user'){
            data["user_" + key] = value;
        }
    }

    let result = await auth_model.updateProfile(user.user_username, data);

    if(!result){
        return res.status(400).send({error: "Ada yang salah"});
    }

    return res.status(200).send(result);
})

module.exports = router;

