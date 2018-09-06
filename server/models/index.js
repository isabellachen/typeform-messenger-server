const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const translateForm = require('../functions/translate-form');

let counter = 0;
let typeform;
let form = {};

readFile(__dirname + '/../data/form.json').then(
  data => (typeform = JSON.parse(data))
);

const saveQuestions = async () => {
  if (!form.answers) {
    form.answers = typeform.fields.map(field => field.title);
  }
  console.log(form);
  //check if the json data has prop answers
  //if not, save the answers
};

const getTranslatedForm = async () => {
  try {
    let data = await readFile(__dirname + '/../data/form.json');
    data = JSON.parse(data);
    saveQuestions(data);
    return translateForm(data);
  } catch (e) {
    console.error('[ERR] getForm: ', e);
  }
};
getTranslatedForm();
const addQuestion = question => {
  if (question.type === 'multiple_choice') {
    answers[counter] = {
      question: question.response.attachment.payload.text,
      ref: question.ref,
      type: question.type
    };
  } else {
    answers[counter] = {
      question: question.response.text,
      ref: question.ref,
      type: question.type
    };
  }
};

const saveReply = answer => {
  if (answers[counter - 1]) answers[counter - 1].answer = answer;
};

const persistAnswers = () => {
  fs.writeFile(
    __dirname + '/data/answers.json',
    JSON.stringify(answers),
    err => {
      if (err) throw err;
      console.log('The answers has been updated!');
    }
  );
};

module.exports = { addQuestion, saveReply, persistAnswers, getTranslatedForm };
