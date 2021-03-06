const axios = require('axios');
const { getConnection, executeQuery, generateApiKey } = require('../../helpers/utils');

const shareFacebook = async (access_token,app_id,artikel_id) => {
    
    const conn = await getConnection();
    
    const artikel = await executeQuery(conn, `SELECT * FROM artikels WHERE artikel_id = '${artikel_id}'`);
    const artikel_judul = artikel[0].artikel_judul;
    const artikel_isi = artikel[0].artikel_isi;

    try{

        const hasil = await axios.post(`https://graph.facebook.com/v2.8/${app_id}/feed?access_token=${access_token}&message=
Judul : ${artikel_judul}
Isi : ${artikel_isi}`);
        var hasilShare = {
            "Judul":artikel_judul,
            "Isi":artikel_isi
        }
        conn.release();
        return hasilShare;
    
    }catch(ex){
        console.log(ex);
        conn.release();
        return null;
    } 
};



module.exports = {shareFacebook}