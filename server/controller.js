const fs = require('fs')
const util = require('util')
const request = require('request')
require('dotenv').config()

const saveForm = require('./functions/typeform-getter')

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

const readFile = util.promisify(fs.readFile)

let counter = 1
const data = []

const getQuestions = async() => {
  console.log('called')
  try {
    let data = await readFile(__dirname + '/data/questions.json')
    data = JSON.parse(data)
    return data
  } catch (e) {
    console.error('[ERR] getQuestions: ', e)
  }
}

const startSurvey = async (ctx) => {
  try {
    let questions = await getQuestions()
    if (!questions) {
      await saveForm()
      questions = await getQuestions()
    }
  } catch (error) {
    console.error('[ERR] startSurvey: ', error)
  }
}

startSurvey()

module.exports = { 
  verifyToken,
  startSurvey,
  receiveMessage, 
}