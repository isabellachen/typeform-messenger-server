const fs = require('fs')
const util = require('util')
const request = require('request')
require('dotenv').config()

const translateForm = require('./functions/translate-form')
const readFile = util.promisify(fs.readFile)

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
  if (question.type === 'multiple_choice') {
    answers[counter] = {
      question: question.response.attachment.payload.text,
      ref: question.ref,
      type: question.type,
    }
  } else {
    answers[counter] = {
      question: question.response.text,
      ref: question.ref,
      type: question.type,
    }
  }
}

const saveReply = (answer) => {
  if (answers[counter - 1]) answers[counter - 1].answer = answer
}

const persistAnswers = () => {
  fs.writeFile(__dirname + '/data/answers.json', JSON.stringify(answers), (err) => {
    if (err) throw err;
    console.log('The answers has been updated!');
  })
}

const addQuestionSendMessage = (sender_psid, response) => {
  addQuestion(translatedForm[counter])
  persistAnswers()
  sendMessage(sender_psid, response)
  counter++
}


const handleMessage = (event) => {
  if (answers.length > 0) saveReply(event.message.text)
  addQuestionSendMessage(event.sender.id, translatedForm[counter].response)
}

const handlePostback = (event) => {
  if (answers.length > 0) saveReply(event.postback.payload)
  addQuestionSendMessage(event.sender.id, translatedForm[counter].response)
}

const startSurvey = async (ctx) => {
  try {
    const body = ctx.request.body

    const form = await getForm()
  
    if (!translatedForm) translatedForm = translateForm(form)

    if (body.object === 'page') {
      body.entry.forEach((entry) => { 
        let event
        event = entry.messaging[0]
        if (event.message) {
          console.log('event.message: ', event.message)
          handleMessage(event)
        } else if (event.postback && event.postback.payload) {
          console.log('event.postback: ', event.postback)
          handlePostback(event)
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