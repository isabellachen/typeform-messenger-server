const request = require('request')
require('dotenv').config()

const verifyToken = (ctx) => {
  if (ctx.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    ctx.body = ctx.query['hub.challenge']
    ctx.status = 200
  } else {
    ctx.body = 'invalid verify token'
    ctx.status = 401
  }
}

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
  })
}

const receiveMessage = (ctx) => {
  let body = ctx.request.body
  if (body.object === 'page') {
    body.entry.forEach((entry) => {
      let event = entry.messaging[0]
      let sender_psid = event.sender.id
      if (event.message) {
        sendMessage(sender_psid, { text: "Echo: " + event.message.text });
      } else if (event.postback) {
        //
      }
      ctx.status = 200
    })
  } else {
    ctx.status = 404
  }
}

module.exports = { receiveMessage, verifyToken }