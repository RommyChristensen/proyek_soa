const axios = require('axios');
const { getConnection, executeQuery, generateApiKey } = require('../../helpers/utils');


const shareFacebook = async (user_id,artikel_id) => {
    const like_id = await generateId("likes", "like_id", "L");
    const conn = await getConnection();
    
    const artikel = await executeQuery(conn, `SELECT * FROM artikels WHERE artikel_id = '${artikel_id}'`);
    const artikel_judul = artikel[0].artikel_judul;
    const artikel_isi = artikel[0].artikel_isi;

    try{
        const hasil = await axios.get(`https://graph.facebook.com/v2.8/${app_id}/feed?access_token=${access_token}&message=${artikel_judul} - ${artikel_isi}`);
        conn.release();
        return hasil;
    }catch(ex){
        //console.log(ex);
        conn.release();
        return null;
    } 
};



module.exports = {shareFacebook}