const { generateId, getConnection, executeQuery } = require("../../helpers/utils");

const getDataById = async (subscribe_id) => {
    const conn = await getConnection();
    const subscribe = await executeQuery(conn, `SELECT * FROM subscribes WHERE subscribe_id = '${subscribe_id}'`);

    const api_key = subscribe[0].subscribe_api_key; 
    conn.release();
    return api_key;
    
}

module.exports = { getDataById };