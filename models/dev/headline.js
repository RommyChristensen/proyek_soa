const { generateId, getConnection, executeQuery, generateJWT } = require('../../helpers/utils');
require('dotenv').config()
const axios = require('axios');

const getDataHeadlines = async (limit = null, country_code = "id") => {
    try{
        const url = `https://newsapi.org/v2/top-headlines?country=${country_code}&apiKey=${process.env.news_api_key}`;
        let result = await axios.get(url);
        if(limit == null) return result.data.articles;
        
        let return_data = [];
        result.data.articles.forEach((d, idx) => {
            if(idx < limit){
                return_data.push(d);
            }
        })

        return return_data;
    }catch(ex){
        console.log(ex);
        return false;
    }
}

module.exports = { getDataHeadlines }

