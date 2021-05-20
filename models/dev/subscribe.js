require('dotenv').config()
const { getConnection, executeQuery, generateId } = require('../../helpers/utils');

const checkPlan = async (plan_id, user_id) => {
    const conn = await getConnection();

    try{
        let result = await executeQuery(conn, `SELECT * FROM plans WHERE plan_id = '${plan_id}'`);
        conn.release();
        if(result.length == 0){
            return 404;
        }
        result = await executeQuery(conn, `SELECT * FROM subscribes WHERE user_id = '${user_id}' AND plan_id = '${plan_id}'`);
        if(result.length > 0){
            return 409;
        }
        return 200;
    }catch(ex){
        conn.release();
        return 500;
    }
}

const insertData = async (user_id, plan_id) => {
    const conn = await getConnection();

    const subscribe_id = await generateId("subscribes", "subscribe_id", "S");
    try{
        const plan_api_hit = await executeQuery(conn, `SELECT plan_api_hit FROM plans WHERE plan_id = '${plan_id}'`);
        const plan_harga = await executeQuery(conn, `SELECT plan_harga FROM plans WHERE plan_id = '${plan_id}'`);
        const result = await executeQuery(conn, `INSERT INTO subscribes VALUES('${subscribe_id}', '${user_id}', '${plan_id}', NULL, NULL, ${plan_api_hit[0].plan_api_hit}, ${plan_harga[0].plan_harga}, NULL, NULL)`);
        conn.release();
        return result;
    }catch(ex){
        conn.release();
        return false;
    }
}

module.exports = { checkPlan, insertData }

