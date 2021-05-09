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
    const data_select = await executeQuery(conn, `SELECT * FROM hashtags WHERE hashtag_id = '${hashtag_id}'`);
    await executeQuery(conn, `UPDATE hashtags SET hashtag_nama = '${hashtag_nama}' WHERE hashtag_id = '${hashtag_id}'`);
    conn.release();
    return {
        hashtag_nama_lama : data_select[0].hashtag_nama,
        hashtag_nama_baru : hashtag_nama
    }
}

const deleteData = async (hashtag_id) => {
    const conn = await getConnection();
    const result = await executeQuery(conn, `DELETE FROM hashtags WHERE hashtag_id = '${hashtag_id}'`);
    conn.release();
    return result;
}

module.exports = { insertData, getData, getDataById, updateData, deleteData };