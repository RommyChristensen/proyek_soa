const { generateId, getConnection, executeQuery } = require("../../helpers/utils");

const getDataById = async (artikel_id,user_id) => {
    const conn = await getConnection();
    const result = await executeQuery(conn, `SELECT * FROM comments WHERE artikel_id = '${artikel_id}' AND user_id = '${user_id}'`);
    conn.release();
    return result;
}

const insertData = async (data) => {
    const comments_id = await generateId("comments", "comment_id", "C");
    const comments_isi = data.comments_isi;
    const user_id = data.user_id;

    const conn = await getConnection();

    try{
        await executeQuery(conn, `INSERT INTO comments VALUES('${comments_id}', '${user_id}', '${artikel_id}','${comments_isi}',now())`);
        conn.release();
        return comments_id;
    }catch(ex){
        conn.release();
        return null;
    } 
};

module.exports = { getDataById ,insertData }