const Router = require('koa-router')
const { replyExchangeRate } = require('../libs/lineConnect')

const router = new Router()

router.get('/', (ctx, next) => {
  ctx.status = 200;
  ctx.body = { msg: 'Hello World' }
});

router.post('/reply', async (ctx, next) => {
  let reply_token = ctx.request.body.events[0].replyToken
  let msg = ctx.request.body.events[0].message.text

  console.log('request /reply', reply_token, msg);

  await replyExchangeRate(reply_token, msg)

  ctx.status = 200
});

module.exports = router