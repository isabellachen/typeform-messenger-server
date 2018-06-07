const fs = require('fs')
const util = require('util')
const request = require('request')
require('dotenv').config()

const saveForm = require('./functions/typeform-getter')
const translateQuestions = require('./functions/translate-questions')
const translateForm = require('./functions/translate-form')
const readFile = util.promisify(fs.readFile)

let translatedQuestions
let translatedForm
let counter = 0
const answers = []

const verifyToken = (ctx) => {
  if (ctx.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    ctx.body = ctx.query['hub.challenge']
    ctx.status = 200
  } else {
    ctx.body = 'invalid verify token'
    ctx.status = 401
  }
}

function sendMessage(recipientId, response) {
  request({
    url: 'https://graph.facebook.com/v3.0/me/messages',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: {
      recipient: { id: recipientId },
      message: response,
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  })
}

const getForm = async() => {
  try {
    let data = await readFile(__dirname + '/data/form.json')
    data = JSON.parse(data)
    return data
  } catch (e) {
    console.error('[ERR] getForm: ', e)
  }
}

const addQuestion = (question) => {
  answers[counter] = {question}
}

const saveReply = (answer) => {
  if (answers[counter - 1]) answers[counter - 1].answer = answer
}

const handleMessage = (event, translatedForm) => {
  let sender_psid = event.sender.id  
  if (counter === 0) {
    sendMessage(sender_psid, translatedForm[counter])
    counter ++
  } else if (counter === 1) {
    addQuestion(translatedForm[counter].title)
    sendMessage(sender_psid, translatedForm[counter])
    counter++
  } else if (translatedForm[counter]) {
    saveReply(event.message.text)
    addQuestion(translatedForm[counter].title)
    sendMessage(sender_psid, translatedForm[counter])
    counter ++
  }
  
  // if (counter === 0) {
  //   addQuestion(questions[counter].title)
  //   sendMessage(sender_psid, translatedForm[counter])
  //   counter++
  // } else if (questions[counter]) {
  //   saveReply(event.message.text)
  //   addQuestion(questions[counter].title)
  //   sendMessage(sender_psid, translatedForm[counter])
  //   counter++
  // } 
}

const handlePostback = (event, questions) => {
  console.log(event)
}

const startSurvey = async (ctx) => {
  try {
    const body = ctx.request.body

    const form = await getForm()
  
    if (!translatedForm) translatedForm = translateForm(form) 

    if (body.object === 'page') {
      body.entry.forEach((entry) => { 
        console.log('ENTRY: ', entry)
        let event
        event = entry.messaging[0]
        if (event.message) {
          console.log('MESSAGE: ', event.message)
          handleMessage(event, translatedForm)
        } else if (event.postback && event.postback.payload) {
          console.log('POSTBACK: ', event.postback)
          // let payload = received_postback.payload
          // handlePostback(payload, questions)
        }
        ctx.status = 200
      })
    } else {
      ctx.status = 404
    }
  } catch (error) {
    console.error('[ERR] startSurvey: ', error)
  }
}

module.exports = { 
  verifyToken,
  startSurvey
}