const { pool } = require('../connection');

function getConnection() {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            } else {
                resolve(connection);
            }
        });
    });
}

function executeQuery(conn, query) {
    return new Promise(function (resolve, reject) {
        conn.query(query, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

const generateId = async (table, column, prefix) => {
    const conn = await getConnection();
    const getCount = await executeQuery(conn, `SELECT IFNULL(MAX(${column}),0) AS count FROM ${table}`);
    conn.release();
    const count = parseInt(getCount[0].count.substr(-1, 4)) + 1;
    return prefix + (count + "").padStart(4, "0");
}

const ifExists = async (table, column, value) => {
    const conn = await getConnection();
    const result = await executeQuery(conn, `SELECT COUNT(*) AS count FROM ${table} WHERE ${column} = '${value}'`);
    if(parseInt(result[0].count) == 0) return false;
    else return true;
}

module.exports = { getConnection, executeQuery, generateId };