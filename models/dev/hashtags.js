const { generateId, getConnection, executeQuery } = require("../../helpers/utils");

const insertData = async (data) => {
    const hashtag_id = await generateId("hashtags", "hashtag_id", "H");
    const { hashtag_nama } = data;

    const conn = await getConnection();

    try{
        await executeQuery(conn, `INSERT INTO hashtags VALUES('${hashtag_id}', '${hashtag_nama}')`);
        conn.release();
        return hashtag_id;
    }catch(ex){
        conn.release();
        return null;
    }
    
};

const getDataByNama = async (hashtag_nama) => {
    const conn = await getConnection();
    const result = await executeQuery(conn, `SELECT * FROM hashtags WHERE hashtag_nama = '${hashtag_nama}'`);
    conn.release();
    return result;
}

module.exports = { insertData, getDataByNama };