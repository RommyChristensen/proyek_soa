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

const getData = async () => {
    const conn = await getConnection();
    const result = await executeQuery(conn, `SELECT * FROM hashtags`);
    conn.release();
    return result;
}

const getDataById = async (hashtag_id) => {
    const conn = await getConnection();
    const result = await executeQuery(conn, `SELECT * FROM hashtags WHERE hashtag_id = '${hashtag_id}'`);
    conn.release();
    return result;
}

const updateData = async (hashtag_id, hashtag_nama) => {
    const conn = await getConnection();
    await executeQuery(conn, `UPDATE hashtags SET hashtag_nama = '${hashtag_nama}' WHERE hashtag_id = '${hashtag_id}'`);
    var hasilupdate = getDataById(hashtag_id);
    conn.release();
    return hasilupdate;
}

const deleteData = async (hashtag_id) => {
    var beforeDelete = getDataById(hashtag_id);
    const conn = await getConnection();
    const result = await executeQuery(conn, `DELETE FROM hashtags WHERE hashtag_id = '${hashtag_id}'`);
    conn.release();
    return beforeDelete;
}

module.exports = { insertData, getData, getDataById, updateData, deleteData };