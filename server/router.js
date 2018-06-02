const Router = require('koa-router')
const fetch = require('cross-fetch')
const request = require('request')
require('dotenv').config()

const conf = require('../private/conf.json')
const typeformToken = conf.tokens.typeform

const router = new Router()

router.get('/webhooks', (ctx) => {
  if (ctx.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    ctx.body = ctx.query['hub.challenge']
    ctx.status = 200
  } else {
    ctx.body = 'invalid verify token'
    ctx.status = 401
  }
})

function sendMessage(recipientId, message) {
  request({
    url: 'https://graph.facebook.com/v3.0/me/messages',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: {
      recipient: { id: recipientId },
      message: message,
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
};

router.post('/webhooks', function (ctx) {
  // console.log(ctx.request.body)
  var events = ctx.request.body.entry[0].messaging;
  for (i = 0; i < events.length; i++) {
    var event = events[i]
    if (event.message && event.message.text) {
      sendMessage(event.sender.id, { text: "Echo: " + event.message.text });
    }
  }
  ctx.status = 200
});

router.get('/forms/:formId', async (ctx) => {
  const form = await fetch(`https://api.typeform.com/forms/${ctx.params.formId}`, {
    headers: {
      "Authorization": `bearer ${typeformToken}`
    }
  }).then(res => res.json())
  ctx.body = form
  ctx.status = 200
})

module.exports = router
