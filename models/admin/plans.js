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

module.exports = { insertData, getData, getDataById, updateData };