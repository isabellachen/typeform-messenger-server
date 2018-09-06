require('dotenv').config();

const { addQuestion, saveReply, persistAnswers } = require('../models');
let { translatedForm, counter, answers } = require('./index');

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

const addQuestionSendMessage = (sender_psid, response) => {
  addQuestion(translatedForm[counter]);
  persistAnswers();
  sendMessage(sender_psid, response);
  counter++;
};

const handleMessage = event => {
  const { answers } = require('./index');
  console.log('ANSWERS: ', answers);
  // if (answers.length > 0) saveReply(event.message.text);
  // addQuestionSendMessage(event.sender.id, translatedForm[counter].response);
};

const handlePostback = event => {
  if (answers.length > 0) saveReply(event.postback.payload);
  addQuestionSendMessage(event.sender.id, translatedForm[counter].response);
};

module.exports = {
  handleMessage,
  handlePostback
};
