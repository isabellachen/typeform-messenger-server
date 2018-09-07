const fs = require('fs');
const util = require('util');
const request = require('request');
const readFile = util.promisify(fs.readFile);
require('dotenv').config();

const { db, persistDb } = require('../models');
const translateForm = require('../functions/translate-form');

let counter = 0;
let translatedForm;

//translate the form and set up the 'db'
readFile(__dirname + '/../data/form.json')
  .then(data => JSON.parse(data))
  .then(json => {
    translatedForm = translateForm(json);
    if (!db.questions) {
      db.questions = json.fields.map(field => field.title);
    }
  })
  .catch(e => console.error(e));

function sendMessage(recipientId, response) {
  request(
    {
      url: 'https://graph.facebook.com/v3.0/me/messages',
      qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: {
        recipient: { id: recipientId },
        message: response
      }
    },
    function(error, response, body) {
      if (error) {
        console.log('Error sending message: ', error);
      } else if (response.body.error) {
        console.log('Error: ', response.body.error);
      }
    }
  );
}

const saveAnswer = (sender_psid, answer) => {
  if (!db[sender_psid]) {
    db[sender_psid] = [answer];
  } else {
    db[sender_psid].push(answer);
  }
  persistDb(db);
};

const handleMessage = async event => {
  saveAnswer(event.sender.id, event.message.text); //omit first message
  if (!db.questions) saveQuestions();
  sendMessage(event.sender.id, translatedForm[counter].response);
  counter++;
};

const handlePostback = event => {
  saveAnswer(event.sender.id, event.postback.payload);
  sendMessage(event.sender.id, translatedForm[counter].response);
  counter++;
};

module.exports = {
  handleMessage,
  handlePostback
};
