const { generateId, getConnection, executeQuery } = require("../../helpers/utils");

const insertData = async (data) => {
    const plan_id = await generateId("plans", "plan_id", "P");
    const plan_nama = data.plan_nama;
    const plan_deskripsi = data.plan_deskripsi;
    const plan_harga = data.plan_harga;

    const conn = await getConnection();

    try{
        await executeQuery(conn, `INSERT INTO plans VALUES('${plan_id}', '${plan_nama}','${plan_deskripsi}','${plan_harga}')`);
        conn.release();
        return plan_id;
    }catch(ex){
        conn.release();
        return null;
    }
};

const getData = async () => {
    const conn = await getConnection();
    const result = await executeQuery(conn, `SELECT * FROM plans`);
    conn.release();
    return result;
}

const getDataById = async (plan_id) => {
    const conn = await getConnection();
    const result = await executeQuery(conn, `SELECT * FROM plans WHERE plan_id = '${plan_id}'`);
    conn.release();
    return result;
}

const updateData = async (plan_id, plan_deskripsi, plan_harga) => {
    const conn = await getConnection();
    const data_select = await executeQuery(conn, `SELECT * FROM plans WHERE plan_id = '${plan_id}'`);
    await executeQuery(conn, `UPDATE plans SET plan_deskripsi = '${plan_deskripsi}', plan_harga = '${plan_harga}' 
                            WHERE plan_id = '${plan_id}'`);
    conn.release();
    return {
        plan_deskripsi_lama : data_select[0].plan_deskripsi,
        plan_deskripsi_baru : plan_deskripsi,
        plan_harga_lama : data_select[0].plan_harga,
        plan_harga_baru : plan_harga
    }
}

const getSubscriber = async () => {
    const conn = await getConnection();
    const resplan = await executeQuery(conn, `SELECT * FROM plans`);
    const ressubs = await executeQuery(conn, `SELECT *, subscribe_tanggal_pembayaran + interval 1 month as masa_berlaku FROM subscribes where subscribe_tanggal_pembayaran 
                                                IS NOT NULL and (now() - interval 1 month)<=subscribe_tanggal_pembayaran`);

    var hasil=[];
    
    for(let i=0;i<resplan.length;i++){
        var plan = resplan[i].plan_id;
        var plan_nama = resplan[i].plan_nama;
        var usersub = [];
        for(let j=0;j<ressubs.length;j++){
            if(ressubs[j].plan_id==plan){
                var tanggal_pembayaran = new Date(ressubs[j].subscribe_tanggal_pembayaran).getDate()+"-"+
                                            (new Date(ressubs[j].subscribe_tanggal_pembayaran).getMonth()+1)+"-"+
                                            new Date(ressubs[j].subscribe_tanggal_pembayaran).getFullYear();
                var berlaku_hingga = new Date(ressubs[j].masa_berlaku).getDate()+"-"+
                                            (new Date(ressubs[j].masa_berlaku).getMonth()+1)+"-"+
                                            new Date(ressubs[j].masa_berlaku).getFullYear();
                var tampung={
                    user_id:ressubs[j].user_id,
                    tanggal_pembayaran:tanggal_pembayaran,
                    berlaku_hingga:berlaku_hingga
                };
                usersub.push(tampung);
            }
        }
        var ambil = {
            plan_id:plan,
            plan_nama:plan_nama,
            users:usersub
        };
        hasil.push(ambil);
    }

    conn.release();
    return hasil;
}

const getSubscriberById = async (plan_id) => {
    const conn = await getConnection();
    const resplan = await executeQuery(conn, `SELECT * FROM plans where plan_id='${plan_id}'`);
    const ressubs = await executeQuery(conn, `SELECT *, subscribe_tanggal_pembayaran + interval 1 month as masa_berlaku FROM subscribes where subscribe_tanggal_pembayaran 
                                                IS NOT NULL and (now() - interval 1 month)<=subscribe_tanggal_pembayaran and plan_id='${plan_id}'`);
    
    var ambil;
    for(let i=0;i<resplan.length;i++){
        var plan = resplan[i].plan_id;
        var plan_nama = resplan[i].plan_nama;
        var usersub = [];
        for(let j=0;j<ressubs.length;j++){
            if(ressubs[j].plan_id==plan){
                var tanggal_pembayaran = new Date(ressubs[j].subscribe_tanggal_pembayaran).getDate()+"-"+
                                            (new Date(ressubs[j].subscribe_tanggal_pembayaran).getMonth()+1)+"-"+
                                            new Date(ressubs[j].subscribe_tanggal_pembayaran).getFullYear();
                var berlaku_hingga = new Date(ressubs[j].masa_berlaku).getDate()+"-"+
                                            (new Date(ressubs[j].masa_berlaku).getMonth()+1)+"-"+
                                            new Date(ressubs[j].masa_berlaku).getFullYear();
                var tampung={
                    user_id:ressubs[j].user_id,
                    tanggal_pembayaran:tanggal_pembayaran,
                    berlaku_hingga:berlaku_hingga
                };
                usersub.push(tampung);
            }
        }
        ambil = {
            plan_id:plan,
            plan_nama:plan_nama,
            users:usersub
        };
    }

    conn.release();
    return ambil;
}


module.exports = { insertData, getData, getDataById, updateData, getSubscriber, getSubscriberById };