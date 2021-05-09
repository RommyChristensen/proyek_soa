const { generateId, getConnection, executeQuery } = require('../../helpers/utils');

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

module.exports = { checkUnique, insert }

