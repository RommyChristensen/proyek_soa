const { generateId, getConnection, executeQuery } = require("../../helpers/utils");

const getData = async () => {
    const conn = await getConnection();
    let returnvalue=[];
    let result = await executeQuery(conn, `SELECT * FROM artikels`);
    for(let i=0;i<result.length;i++){
        let artikel_id_chosen = result[i].artikel_id;
        let kategori_id = result[i].kategori_id;
        let user_id = result[i].user_id;
        let artikel_judul = result[i].artikel_judul;
        let artikel_isi = result[i].artikel_isi;
        let artikel_tanggal = result[i].artikel_tanggal;
        let artikel_foto = result[i].artikel_foto;
        let hashtag_used = [];
        let resulthashtag = await executeQuery(conn, `SELECT * FROM hashtag_artikel WHERE artikel_id='${artikel_id_chosen}'`);
        for(let j=0;j<resulthashtag.length;j++){
            hashtag_used.push(resulthashtag[j]);
        }
        let comments = [];
        let resultcomment = await executeQuery(conn, `SELECT * FROM comments WHERE artikel_id='${artikel_id_chosen}'`);
        for(let j=0;j<resultcomment.length;j++){
            let comment_id = resultcomment[j].comment_id;
            let user_id_comment = resultcomment[j].user_id;
            let comment_isi = resultcomment[j].comment_isi;
            let tanggal_comment = resultcomment[j].tanggal_comment;
            let hashtag_used_in_comments=[];
            let hashtag_comment = await executeQuery(conn, `SELECT * FROM hashtag_comment WHERE comment_id='${comment_id}'`);
            for(let k=0;k<hashtag_comment.length;k++){
                hashtag_used_in_comments.push(hashtag_comment[k]);
            }
            var tampung = {
                comment_id:comment_id,
                comment_user:user_id_comment,
                comment_isi:comment_isi,
                comment_tanggal:tanggal_comment,
                comment_hashtags:hashtag_used_in_comments
            }
            comments.push(tampung);
        }
        var likes=await executeQuery(conn, `SELECT * FROM likes WHERE artikel_id='${artikel_id_chosen}'`);
        var liked_by=[];
        for(let j=0;j<likes.length;j++){
            liked_by.push(likes[j].user_id);
        }
        var perartikel={
            artikel_id:artikel_id_chosen,
            kategori_id:kategori_id,
            user_id:user_id,
            artikel_judul:artikel_judul,
            artikel_isi:artikel_isi,
            artikel_tanggal:artikel_tanggal,
            artikel_foto:artikel_foto,
            hashtag_used:hashtag_used,
            comments:comments,
            liked_by:liked_by
        };
        returnvalue.push(perartikel);
    }
    conn.release();
    return returnvalue;
}
const getDataById = async (artikel_id) => {
    const conn = await getConnection();
    let returnvalue=[];
    let result = await executeQuery(conn, `SELECT * FROM artikels WHERE artikel_id like '%${artikel_id}%'`);
    for(let i=0;i<result.length;i++){
        let artikel_id_chosen = result[i].artikel_id;
        let kategori_id = result[i].kategori_id;
        let user_id = result[i].user_id;
        let artikel_judul = result[i].artikel_judul;
        let artikel_isi = result[i].artikel_isi;
        let artikel_tanggal = result[i].artikel_tanggal;
        let artikel_foto = result[i].artikel_foto;
        let hashtag_used = [];
        let resulthashtag = await executeQuery(conn, `SELECT * FROM hashtag_artikel WHERE artikel_id='${artikel_id_chosen}'`);
        for(let j=0;j<resulthashtag.length;j++){
            hashtag_used.push(resulthashtag[j]);
        }
        let comments = [];
        let resultcomment = await executeQuery(conn, `SELECT * FROM comments WHERE artikel_id='${artikel_id_chosen}'`);
        for(let j=0;j<resultcomment.length;j++){
            let comment_id = resultcomment[j].comment_id;
            let user_id_comment = resultcomment[j].user_id;
            let comment_isi = resultcomment[j].comment_isi;
            let tanggal_comment = resultcomment[j].tanggal_comment;
            let hashtag_used_in_comments=[];
            let hashtag_comment = await executeQuery(conn, `SELECT * FROM hashtag_comment WHERE comment_id='${comment_id}'`);
            for(let k=0;k<hashtag_comment.length;k++){
                hashtag_used_in_comments.push(hashtag_comment[k]);
            }
            var tampung = {
                comment_id:comment_id,
                comment_user:user_id_comment,
                comment_isi:comment_isi,
                comment_tanggal:tanggal_comment,
                comment_hashtags:hashtag_used_in_comments
            }
            comments.push(tampung);
        }
        var likes=await executeQuery(conn, `SELECT * FROM likes WHERE artikel_id='${artikel_id_chosen}'`);
        var liked_by=[];
        for(let j=0;j<likes.length;j++){
            liked_by.push(likes[j].user_id);
        }
        var perartikel={
            artikel_id:artikel_id_chosen,
            kategori_id:kategori_id,
            user_id:user_id,
            artikel_judul:artikel_judul,
            artikel_isi:artikel_isi,
            artikel_tanggal:artikel_tanggal,
            artikel_foto:artikel_foto,
            hashtag_used:hashtag_used,
            comments:comments,
            liked_by:liked_by
        };
        returnvalue.push(perartikel);
    }
    conn.release();
    return returnvalue;
}
module.exports = {getData,getDataById};