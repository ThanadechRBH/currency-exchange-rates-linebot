const appConfig = require('../configs');
const axios = require('axios');
const exchangeRate = require('./exchangeRate')

let headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer {${appConfig.LINE_ACCESS_TOKEN_API}}`
}

const replyExchangeRate = async (reply_token, msg) => {

  const exchangeData = await exchangeRate
  const numberRegex = /[+-]?\d+(?:\.\d+)?/g

  let defaultFrom = 'USD'
  let defaultTo = 'THB'
  let convertFrom = ''
  let convertTo = ''
  let rates = exchangeData.rates
  let base = exchangeData.baseCurrency
  let result = 0
  let message = ''

  let body = JSON.stringify({
    replyToken: reply_token,
    messages: [{
      type: 'text',
      text: 'Please typing the number convert the currency ex. "1 ure to"'
    }]
  })

  let rateFrom = ''
  let rateTo = ''

  if (msg) {
    message = msg
  }

  let getNumber = numberRegex.exec(message)
  let allWords = message.split(' ')

  await allWords.forEach((word) => {
    if (exchangeData.currencies.includes(word.toUpperCase()) && convertFrom === '') {
      convertFrom = word.toUpperCase();
    } else if (exchangeData.currencies.includes(word.toUpperCase()) && convertTo === '') {
      convertTo = word.toUpperCase();
    }
  })

  if (getNumber !== null) {

    if (convertFrom !== '') {
      rateFrom = convertFrom
      if (convertTo !== '') {
        rateTo = convertTo
      } else {
        rateTo = defaultTo
      }
    } else {
      rateFrom = defaultFrom
      rateTo = defaultTo
    }

    result = ((((rates[base]*getNumber[0])/rates[rateFrom])*rates[rateTo])/rates[base]).toFixed(4)

    body = JSON.stringify({
      replyToken: reply_token,
      messages: [{
        type: 'text',
        text: `Convert ${getNumber[0]} ${rateFrom} to ${result} ${rateTo}`
      }]
    })
  }

  // return {
  //   body: body,
  //   headers: headers,
  //   result: result,
  //   from: rateFrom,
  //   to: rateTo,
  //   amount: getNumber
  // }

  await axios({
    method: 'post',
    url: appConfig.LINE_API_URL,
    headers: headers,
    data: body
  }).then(res => {
    console.log('response', res)
  }).catch(err => {
    console.log('catch err', err)
  })

}

module.exports.replyExchangeRate = replyExchangeRate