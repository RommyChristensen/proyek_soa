const { generateId, getConnection, executeQuery } = require("../../helpers/utils");

const getDataById = async (plan_id) => {
    const conn = await getConnection();
    const plan = await executeQuery(conn, `SELECT * FROM plans WHERE plan_id = '${plan_id}'`);

    if(plan.length > 0){
        conn.release();
        return plan;
    }else{
        const arr_plan = [];
        const list_plan = await executeQuery(conn, `SELECT * FROM plans`);
        for(let i=0;i<list_plan.length;i++){
            arr_plan.push(list_plan[i]);
        }
        conn.release();
        return arr_plan;
    }
}

module.exports = { getDataById };