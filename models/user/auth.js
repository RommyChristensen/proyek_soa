const { generateId, getConnection, executeQuery, generateJWT } = require('../../helpers/utils');

const checkUnique = async (table, column, value) => {  
    const conn = await getConnection();

    try{
        const count = await executeQuery(conn, `SELECT COUNT(*) AS c FROM ${table} WHERE ${column} = '${value}'`);
        conn.release();
        if(parseInt(count[0].c) > 0){
            return false;
        }
        return true;
    }catch(ex){
        conn.release();
        return false;
    }
}

const insert = async (table, data) => {
    const conn = await getConnection();
    const { user_username, user_password, user_email, user_tanggal_lahir, user_nama } = data;
    const user_id = await generateId("users", "user_id", "U");
    try{
        await executeQuery(conn, `INSERT INTO users VALUES('${user_id}', '${user_username}', '${user_password}', '${user_nama}', '${user_email}', STR_TO_DATE('${user_tanggal_lahir}', '%d/%m/%Y'))`);
        conn.release();
        return true;
    }catch(ex){
        conn.release();
        return false;
    }
}

const checkUsernamePassword = async (data) => {
    const conn = await getConnection();
    const { user_username, user_password } = data;
    try{
        let result = await executeQuery(conn, `SELECT * FROM users WHERE user_username = '${user_username}' AND user_password = '${user_password}'`);
        if(result.length > 0){
            let data = JSON.parse(JSON.stringify(result[0]));
            return generateJWT(data);
        }
        return false;
    }catch(ex){
        conn.release();
        return false;
    }
}
const getDataById = async (user_id) => {
    const conn = await getConnection();
    const resuser = await executeQuery(conn, `SELECT * FROM users where user_id='${user_id}'`);
    const ressubs = await executeQuery(conn, `SELECT *, subscribe_tanggal_pembayaran + interval 1 month as masa_berlaku FROM subscribes where subscribe_tanggal_pembayaran 
                                                IS NOT NULL and (now() - interval 1 month)<=subscribe_tanggal_pembayaran`);
    var ambil;
    for(let i=0;i<resuser.length;i++){
        var user_id = resuser[i].user_id;
        var user_nama = resuser[i].user_nama;
        var user_username = resuser[i].user_username;
        var user_email = resuser[i].user_email;
        var user_tanggal_lahir = resuser[i].user_tanggal_lahir;
        var tanggal = new Date(user_tanggal_lahir).getDate().toString();
        var bulan = (new Date(user_tanggal_lahir).getMonth()+1).toString();
        var tahun = new Date(user_tanggal_lahir).getFullYear().toString();
        var rangkaitanggal = tanggal.padStart(2,'0')+"/"+bulan.padStart(2,'0')+"/"+tahun;
        var ambil={
            user_id:user_id,
            user_username:user_username,
            user_nama:user_nama,
            user_email:user_email,
            user_tanggal_lahir:rangkaitanggal
        };
    }
    conn.release();
    return ambil;
}
const updateProfile = async (user_id, data) => {
    const conn = await getConnection();
    let set = "SET ";
    let selectField = "";
    let i = 0;
    for (const [key, value] of Object.entries(data)) {
        if(i != 0){
            set += ", ";
            selectField += ", ";
        }
        if(key=="user_tanggal_lahir"){
            set += key + " = " + "STR_TO_DATE('"+value+"', '%d/%m/%Y')";
        }
        else{
            set += key + " = '" + value + "'";
        }
        selectField += key;
        i++;
    }
    try{
        await executeQuery(conn, `UPDATE users ${set} WHERE user_id = '${user_id}'`);

        let returnData = getDataById(user_id);
        conn.release();
        return returnData;
    }catch(ex){
        conn.release();
        return false;
    }
}

module.exports = { checkUnique, insert, checkUsernamePassword, updateProfile }

