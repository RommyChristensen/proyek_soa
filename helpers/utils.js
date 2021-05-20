const { pool } = require('../connection');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
require('dotenv').config()

function getConnection() {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            } else {
                resolve(connection);
            }
        });
    });
}

function executeQuery(conn, query) {
    return new Promise(function (resolve, reject) {
        conn.query(query, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

const generateId = async (table, column, prefix) => {
    const conn = await getConnection();
    const getCount = await executeQuery(conn, `SELECT IFNULL(MAX(${column}),0) AS count FROM ${table}`);
    conn.release();
    let count=1;
    if(getCount[0].count!=0){
        let startAmbil = prefix.length;
        count=parseInt(getCount[0].count.substr(startAmbil));
        count++;
        //const count = parseInt(getCount[0].count.substr(-1, 4)) + 1;
    }
    return prefix + (count + "").padStart(4, "0");
}

const generateApiKey = () => {
    return randomBytes(8).toString('hex');
}

const ifExists = async (table, column, value) => {
    const conn = await getConnection();
    const result = await executeQuery(conn, `SELECT COUNT(*) AS count FROM ${table} WHERE ${column} = '${value}'`);
    conn.release();
    if(parseInt(result[0].count) == 0) return false;
    else return true;
}

const generateJWT = async (data) => {
    const data_user = jwt.sign(data, process.env.secret, {expiresIn: "45m"});
    return data_user;
}

const checkApiKey = async apiKey => {
    const conn = await getConnection();
    const result = await executeQuery(conn, `SELECT u.*, s.subscribe_api_hit FROM subscribes s JOIN users u ON u.user_id = s.user_id WHERE 
                            s.subscribe_api_key = '${apiKey}' AND 
                            s.subscribe_tanggal_pembayaran IS NOT NULL AND
                            (now() - interval 1 month)<=subscribe_tanggal_pembayaran
                            `);
    conn.release();
    if(result.length == 0){
        return {
            code: 404,
            msg: "Invalid API KEY"
        };
    }
    if(result[0].subscribe_api_hit <= 0){
        return {
            code: 400,
            msg: "Api Hit tidak mencukupi"
        }
    }

    await executeQuery(conn, `UPDATE subscribes SET subscribe_api_hit = subscribe_api_hit - 1 WHERE subscribe_api_key = '${apiKey}'`);
    return result[0];
}

const checkApiKeyArtikel = async apiKey => {
    const conn = await getConnection();
    const result = await executeQuery(conn, `SELECT u.*, s.subscribe_api_hit FROM subscribes s JOIN users u ON u.user_id = s.user_id WHERE 
                            s.subscribe_api_key = '${apiKey}' AND 
                            s.subscribe_tanggal_pembayaran IS NOT NULL AND
                            (now() - interval 1 month)<=subscribe_tanggal_pembayaran
                            `);
    conn.release();
    if(result.length == 0){
        return {
            code: 404,
            msg: "Invalid API KEY"
        };
    }
    else if(result[0].subscribe_api_hit <= 0){
        return {
            code: 400,
            msg: "Api Hit tidak mencukupi"
        }
    }
    else{
        await executeQuery(conn, `UPDATE subscribes SET subscribe_api_hit = subscribe_api_hit - 1 WHERE subscribe_api_key = '${apiKey}'`);
        return {
            code: 200,
            msg: "Sukses",
            user: result[0]
        }
    }
}

const checkApiKeyFB = async apiKey => {
    const conn = await getConnection();
    const result = await executeQuery(conn, `SELECT u.*, s.subscribe_api_hit FROM subscribes s JOIN users u ON u.user_id = s.user_id WHERE 
                            s.subscribe_api_key = '${apiKey}' AND 
                            s.subscribe_tanggal_pembayaran IS NOT NULL AND
                            (now() - interval 1 month)<=subscribe_tanggal_pembayaran
                            `);
    conn.release();
    if(result.length == 0){
        return {
            code: 404,
            msg: "Invalid API KEY"
        };
    }
    if(result[0].subscribe_api_hit <= 0){
        return {
            code: 400,
            msg: "Api Hit tidak mencukupi"
        }
    }
    if(result[0].plan_id!='P0001'){
        return {
            code: 400,
            msg: "Anda tidak memiliki ApiKey untuk Share Facebook"
        }
    }

    await executeQuery(conn, `UPDATE subscribes SET subscribe_api_hit = subscribe_api_hit - 1 WHERE subscribe_api_key = '${apiKey}'`);
    return result[0];
}

module.exports = { getConnection, executeQuery, generateId, ifExists, generateJWT, generateApiKey, checkApiKey, checkApiKeyFB, checkApiKeyArtikel };