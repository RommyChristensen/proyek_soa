const { generateId, getConnection, executeQuery } = require("../../helpers/utils");

const likeArtikel = async (user_id,artikel_id) => {
    const like_id = await generateId("likes", "like_id", "L");

    const conn = await getConnection();
    // result = [];
    try{
        await executeQuery(conn, `INSERT INTO likes VALUES('${like_id}', '${user_id}', '${artikel_id}')`);
        const totalLike = await executeQuery(conn, `SELECT * FROM likes WHERE artikel_id = '${artikel_id}'`);
        conn.release();
        return {
            artikel_id:artikel_id,
            total_like:totalLike.length
        };
    }catch(ex){
        //console.log(ex);
        conn.release();
        return null;
    } 
};

const unlikeArtikel = async (user_id,artikel_id) => {
    const conn = await getConnection();
    const result = await executeQuery(conn, `DELETE FROM likes WHERE user_id = '${user_id}' AND artikel_id = '${artikel_id}'`);
    conn.release();
    return result;
};

const cekUser = async (user_id,artikel_id) => {
    const conn = await getConnection();
    const result = await executeQuery(conn, `SELECT * FROM likes WHERE user_id = '${user_id}' AND artikel_id = '${artikel_id}'`);
    conn.release();
    if(parseInt(result.length) == 0) return false;
    else return true;
}


module.exports = {likeArtikel, unlikeArtikel,cekUser}