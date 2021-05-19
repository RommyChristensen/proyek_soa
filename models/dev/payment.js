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

const requestPaymentCC = async (card, subscribe_id) => {
    card.client_key = midtransCore.apiConfig.clientKey;
    
    try{
           
    }catch(ex){
        console.log(ex);
    }

    const cardToken = await midtransCore.cardToken(card);
    const conn = await getConnection();
    let result = await executeQuery(conn, `SELECT * FROM subscribes WHERE subscribe_id = '${subscribe_id}'`);
    if(result.length == 0){
        return 404;
    }

    const parameter = {
        "payment_type": "credit_card",
        "transaction_details": {
            "gross_amount": result[0].subscribe_jumlah_bayar,
            "order_id": "t" + new Date().getTime(),
        },
        "credit_card":{
            "token_id": cardToken.token_id
        }
    };
        
    const chargeResponse = await midtransCore.charge(parameter);
    console.log(chargeResponse);
    if(chargeResponse.fraud_status == "accept"){
        const api_key = generateApiKey();
        let hasil = await executeQuery(conn, `UPDATE subscribes SET order_status = '${chargeResponse.channel_response_message}', subscribe_tanggal_pembayaran = now(), order_id = '${chargeResponse.order_id}', subscribe_api_key = '${api_key}' WHERE subscribe_id = '${subscribe_id}'`);
        conn.release();
        return {
            code: 200,
            msg: "Sukses", 
            api_key: api_key
        }
    }
    else{
        conn.release();
        return {
            code: 400,
            msg: "Pembayaran Gagal"
        };
    }
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