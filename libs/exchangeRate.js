const appConfig = require('../configs');
const axios = require('axios');

async function getExchangeRate() {
  let exchangeData = await axios.get(appConfig.EXCHANGE_RATE_URL)
  return {
    date: exchangeData.data.date,
    rates: exchangeData.data.rates,
    currencies: Object.keys(exchangeData.data.rates),
    baseCurrency: exchangeData.data.base
  }
}

module.exports = getExchangeRate()