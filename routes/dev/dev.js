const express = require('express');
const utils = require('../../helpers/utils');
const router = express.Router();

router.post('/', async (req, res) => {

    let { username, password } = req.body;
    const conn = await utils.getConnection();
    let result = await utils.executeQuery(conn, `SELECT * FROM users WHERE user_username = '${username}' AND user_password = '${password}'`);

    if(result.length == 0){
        return res.status(404).send({error: "Username atau password Salah"});
    }

    result = result[0];
    const subscribes = await utils.executeQuery(conn, `SELECT subscribe_api_key FROM subscribes WHERE user_id = '${result.user_id}'`);
    if(subscribes.length == 0){
        return res.status(401).send({error: "Tidak ada subscription"});
    }

    if(subscribes[0].subscribe_api_key == null){
        return res.status(401).send({error: "Belum bayar subscription"});
    }

    return res.status(200).send({api_key : subscribes[0].subscribe_api_key});
})

module.exports = router;

