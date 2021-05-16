const { generateId, getConnection, executeQuery } = require("../../helpers/utils");

const getData = async () => {
    const conn = await getConnection();
    const resuser = await executeQuery(conn, `SELECT * FROM users`);
    const ressubs = await executeQuery(conn, `SELECT *, subscribe_tanggal_pembayaran + interval 1 month as masa_berlaku FROM subscribes where subscribe_tanggal_pembayaran 
                                                IS NOT NULL and (now() - interval 1 month)<=subscribe_tanggal_pembayaran`);
    var hasil=[];
    for(let i=0;i<resuser.length;i++){
        var user_id = resuser[i].user_id;
        var user_nama = resuser[i].user_nama;
        var user_username = resuser[i].user_username;
        var subscribe=[];
        for(let j=0;j<ressubs.length;j++){
            if(ressubs[j].user_id==user_id){
                var tanggal_pembayaran = new Date(ressubs[j].subscribe_tanggal_pembayaran).getDate()+"-"+
                                            (new Date(ressubs[j].subscribe_tanggal_pembayaran).getMonth()+1)+"-"+
                                            new Date(ressubs[j].subscribe_tanggal_pembayaran).getFullYear();
                var berlaku_hingga = new Date(ressubs[j].masa_berlaku).getDate()+"-"+
                                            (new Date(ressubs[j].masa_berlaku).getMonth()+1)+"-"+
                                            new Date(ressubs[j].masa_berlaku).getFullYear();
                var tampung={
                    plan_id:ressubs[j].plan_id,
                    tanggal_pembayaran:tanggal_pembayaran,
                    berlaku_hingga:berlaku_hingga
                };
                subscribe.push(tampung);
            }
        }
        var ambil={
            user_id:user_id,
            user_username:user_username,
            user_nama:user_nama,
            plan_subscribed:subscribe
        };
        hasil.push(ambil);
    }
    conn.release();
    return hasil;
}

const getDataById = async (user_id) => {
    const conn = await getConnection();
    const resuser = await executeQuery(conn, `SELECT * FROM users where user_id='${user_id}'`);
    const ressubs = await executeQuery(conn, `SELECT *, subscribe_tanggal_pembayaran + interval 1 month as masa_berlaku FROM subscribes where subscribe_tanggal_pembayaran 
                                                IS NOT NULL and (now() - interval 1 month)<=subscribe_tanggal_pembayaran`);
    var ambil;
    for(let i=0;i<resuser.length;i++){
        var user_id = resuser[i].user_id;
        var user_nama = resuser[i].user_nama;
        var user_username = resuser[i].user_username;
        var subscribe=[];
        for(let j=0;j<ressubs.length;j++){
            if(ressubs[j].user_id==user_id){
                var tanggal_pembayaran = new Date(ressubs[j].subscribe_tanggal_pembayaran).getDate()+"-"+
                                            (new Date(ressubs[j].subscribe_tanggal_pembayaran).getMonth()+1)+"-"+
                                            new Date(ressubs[j].subscribe_tanggal_pembayaran).getFullYear();
                var berlaku_hingga = new Date(ressubs[j].masa_berlaku).getDate()+"-"+
                                            (new Date(ressubs[j].masa_berlaku).getMonth()+1)+"-"+
                                            new Date(ressubs[j].masa_berlaku).getFullYear();
                var tampung={
                    plan_id:ressubs[j].plan_id,
                    tanggal_pembayaran:tanggal_pembayaran,
                    berlaku_hingga:berlaku_hingga
                };
                subscribe.push(tampung);
            }
        }
        var ambil={
            user_id:user_id,
            user_username:user_username,
            user_nama:user_nama,
            plan_subscribed:subscribe
        };
    }
    conn.release();
    return ambil;
}

module.exports = { getData, getDataById };