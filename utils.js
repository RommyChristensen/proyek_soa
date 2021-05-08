const { pool } = require('./connection');

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
    const getCount = await executeQuery(conn, `SELECT IFNULL(MAX(RIGHT('${column}',4)),0) AS count FROM ${table}`);
    conn.release();
    return prefix + ((parseInt(getCount[0].count) + 1) + "").padStart(4, "0");
}

module.exports = { getConnection, executeQuery, generateId };