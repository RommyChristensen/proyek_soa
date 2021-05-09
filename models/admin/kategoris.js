const { generateId, getConnection, executeQuery } = require("../../helpers/utils");

const insertData = async (data) => {
    const kategori_id = await generateId("kategoris", "kategori_id", "K");
    const { kategori_nama } = data;

    const conn = await getConnection();

    try{
        await executeQuery(conn, `INSERT INTO kategoris VALUES('${kategori_id}', '${kategori_nama}')`);
        conn.release();
        return true;
    }catch(ex){
        conn.release();
        return false;
    }
};

const getData = async () => {
    const conn = await getConnection();
    const result = await executeQuery(conn, `SELECT * FROM kategoris`);
    conn.release();
    return result;
}

const getDataById = async (kategori_id) => {
    const conn = await getConnection();
    const result = await executeQuery(conn, `SELECT * FROM kategoris WHERE kategori_id = '${kategori_id}'`);
    conn.release();
    return result;
}

const updateData = async (kategori_id, kategori_nama) => {
    const conn = await getConnection();
    const data_select = await executeQuery(conn, `SELECT * FROM kategoris WHERE kategori_id = '${kategori_id}'`);
    await executeQuery(conn, `UPDATE kategoris SET kategori_nama = '${kategori_nama}' WHERE kategori_id = '${kategori_id}'`);
    return {
        kategori_nama_lama : data_select[0].kategori_nama,
        kategori_nama_baru : kategori_nama
    }
}

const deleteData = async (kategori_id) => {
    const conn = await getConnection();
    const result = await executeQuery(conn, `DELETE FROM kategoris WHERE kategori_id = '${kategori_id}'`);
    conn.release();
    return result;
}

const ifExists = async (table, column, value) => {
    const conn = await getConnection();
    const result = await executeQuery(conn, `SELECT COUNT(*) AS count FROM ${table} WHERE ${column} = '${value}'`);
    if(parseInt(result[0].count) == 0) return false;
    else return true;
}

module.exports = { insertData, getData, getDataById, updateData, deleteData, ifExists };