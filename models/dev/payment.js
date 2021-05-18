const midtransClient = require('midtrans-client');
const axios = require('axios');
const { getConnection, executeQuery, generateApiKey } = require('../../helpers/utils');

let midtransCore = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: process.env.server_key,
    clientKey: process.env.client_key
});

const requestPaymentBT = async (data) => {
    const order_id = "t" + new Date().getTime();
    const parameter = {
        "payment_type": "bank_transfer",
        "transaction_details": {
            "gross_amount": data.subscribe_jumlah_bayar,
            "order_id": order_id,
        },
        "bank_transfer": {
            "bank": "bca"
        }
    };
    const chargeResponse = await midtransCore.charge(parameter);

    let conn = await getConnection();
    let update = await executeQuery(conn, `UPDATE subscribes SET order_id = '${order_id}', order_status = '${chargeResponse.transaction_status}' WHERE subscribe_id = '${data.subscribe_id}'`)

    return chargeResponse;
    // return res.status(200).send({
    //     "msg": `mohon transfer ke : ${chargeResponse.va_numbers[0].va_number}`
    // });
}

const completePaymentBT = async (order_id, order_status) => {
    const conn = await getConnection();
    const api_key = generateApiKey();
    try{
        await executeQuery(conn, `UPDATE subscribes SET order_status = '${order_status}', subscribe_api_key = '${api_key}', subscribe_tanggal_pembayaran = now() WHERE order_id = '${order_id}'`);
        conn.release();
        return true;
    }catch(ex){
        console.log(ex);
        conn.release();
        return false;
    }
}

const requestPaymentCC = async () => {

}

const checkSubscription = async (subscribe_id) => {
    const conn = await getConnection();

    try{
        let result = await executeQuery(conn, `SELECT * FROM subscribes WHERE subscribe_id = '${subscribe_id}'`);
        conn.release();
        if(result.length == 0){
            return 404;
        }
        return result[0];
    }catch(ex){
        conn.release();
        return 500;
    }
}

module.exports = { requestPaymentBT, requestPaymentCC, checkSubscription, completePaymentBT };