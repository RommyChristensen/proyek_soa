const { generateId, getConnection, executeQuery } = require("../../helpers/utils");

const insertData = async (data) => {
    const artikel_id = await generateId("artikels", "artikel_id", "A");

    const conn = await getConnection();
    let hashtag = data.hashtag;
    for(let i=0;i<hashtag.length;i++){
        try{
            const hashtag_artikel = await generateId("hashtag_artikel", "hashtag_artikel_id", "HA");
            await executeQuery(conn, `INSERT INTO hashtag_artikel VALUES('${hashtag_artikel}', '${hashtag[i]}','${artikel_id}')`);
        }catch(ex){
            conn.release();
            return null;
        }
    }

    try{
        await executeQuery(conn, `INSERT INTO artikels VALUES('${artikel_id}', '${data.kategori_id}','${data.user_id}',
                            '${data.artikel_judul}','${data.artikel_isi}',now(),'${data.artikel_foto}')`);
        conn.release();
        return artikel_id;
    }catch(ex){
        conn.release();
        return null;
    }
};

module.exports = { insertData};