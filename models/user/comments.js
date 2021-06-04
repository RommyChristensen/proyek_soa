const { generateId, getConnection, executeQuery } = require("../../helpers/utils");

const getDataById = async (artikel_id) => {
    const conn = await getConnection();
    const comment = await executeQuery(conn, `SELECT * FROM comments WHERE artikel_id = '${artikel_id}'`);
    const result = [];

    for(let i=0;i<comment.length;i++){
        const arr_hashtag = [];
        const listHashtag = await executeQuery(conn, `SELECT * FROM hashtag_comment WHERE comment_id = '${comment[i].comment_id}'`);
        for(let i=0;i<listHashtag.length;i++){
            const hashtag = await executeQuery(conn, `SELECT * FROM hashtags WHERE hashtag_id = '${listHashtag[i].hashtag_id}'`);
            arr_hashtag.push(hashtag[0].hashtag_nama);
        }

        result.push({
            detail:comment[i],
            hashtag:arr_hashtag
        });
    }
    conn.release();
    return result;
}

const getDataByIdComment = async (artikel_id) => {
    const conn = await getConnection();
    const comment = await executeQuery(conn, `SELECT * FROM comments WHERE comment_id = '${artikel_id}'`);
    const result = [];

    for(let i=0;i<comment.length;i++){
        const arr_hashtag = [];
        const listHashtag = await executeQuery(conn, `SELECT * FROM hashtag_comment WHERE comment_id = '${comment[i].comment_id}'`);
        for(let i=0;i<listHashtag.length;i++){
            const hashtag = await executeQuery(conn, `SELECT * FROM hashtags WHERE hashtag_id = '${listHashtag[i].hashtag_id}'`);
            arr_hashtag.push(hashtag[0].hashtag_nama);
        }

        result.push({
            detail:comment[i],
            hashtag:arr_hashtag
        });
    }

    conn.release();
    return result;
}

const insertData = async (data) => {
    const comments_id = await generateId("comments", "comment_id", "C");
    const comments_isi = data.comment_isi;
    const user_id = data.user_id;
    const artikel_id = data.artikel_id;

    const conn = await getConnection();

    let hashtag = data.hashtag;

    for(let i=0;i<hashtag.length;i++){
        try{
            const hashtag_comment = await generateId("hashtag_comment", "hashtag_comment_id", "HC");
            await executeQuery(conn, `INSERT INTO hashtag_comment VALUES('${hashtag_comment}', '${comments_id}' ,'${hashtag[i]}')`);
        }catch(ex){
            conn.release();
            return null;
        }
    }

    try{
        await executeQuery(conn, `INSERT INTO comments VALUES('${comments_id}', '${user_id}', '${artikel_id}','${comments_isi}',now())`);
        conn.release();
        return comments_id;
    }catch(ex){
        //console.log(ex);
        conn.release();
        return null;
    } 
};

const deleteData = async (comment_id) => {
    var beforeDelete = getDataByIdComment(comment_id);
    const conn = await getConnection();
    const result = await executeQuery(conn, `DELETE FROM comments WHERE comment_id = '${comment_id}'`);
    const result1 = await executeQuery(conn, `DELETE FROM hashtag_comment WHERE comment_id = '${comment_id}'`);
    conn.release();
    return beforeDelete;
}


const cekUser = async (comment_id,user_id) => {
    const conn = await getConnection();
    const result = await executeQuery(conn, `SELECT * FROM comments WHERE comment_id = '${comment_id}' AND user_id = '${user_id}'`);
    conn.release();
    if(parseInt(result.length) == 0) return false;
    else return true;
}

module.exports = { getDataById ,insertData, deleteData, cekUser}