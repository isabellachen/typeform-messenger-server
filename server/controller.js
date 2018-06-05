const fs = require('fs')
const util = require('util')
const request = require('request')
require('dotenv').config()

const saveForm = require('./functions/typeform-getter')
const readFile = util.promisify(fs.readFile)

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


let counter = 0
const data = []

const getQuestions = async() => {
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
    let body = ctx.request.body

    let questions = await getQuestions()
    if (!questions) {
      await saveForm()
      questions = await getQuestions()
    }
  
    //working temprementally, for some reason an infinite loop is created or all questions at sent at one go... why?
    if (body.object === 'page') {
      body.entry.forEach((entry) => {
        let event = entry.messaging[0]
        let sender_psid = event.sender.id   
        if (event.message) {
          if (counter === 0) {         
            sendMessage(sender_psid, {text: questions[counter].title})
            counter ++
          } else if (questions[counter]) {
            //receive answer
            console.log('EVENT: ', event.message.text)
            if (event.message) console.log(event.message.text)
            sendMessage(sender_psid, { text: questions[counter].title })
            counter ++
          } 
        }
        ctx.status = 200
      })
    } else {
      ctx.status = 404
    }

    //if counter === 0, start by sending the first questions
    //if not, save the event.message.text or event.postback

    //pick question depending on counter - question[counter]
    //format payload to fb depending on question[counter].type
    //construct response and save to data
  } catch (error) {
    console.error('[ERR] startSurvey: ', error)
  }
}

module.exports = { 
  verifyToken,
  startSurvey,
  receiveMessage, 
}