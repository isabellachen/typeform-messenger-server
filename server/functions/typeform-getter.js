const fs = require('fs');
const fetch = require('cross-fetch');
require('dotenv').config();

const conf = require('../../private/conf.json');
const typeformToken = conf.tokens.typeform;

const getForm = async () => {
  const form = await fetch(
    `https://api.typeform.com/forms/${process.env.FORM_ID}`,
    {
      headers: {
        Authorization: `bearer ${process.env.TYPEFORM_TOKEN}`
      }
    }
  ).then(res => res.json());

  return form;
};

const saveForm = async () => {
  const form = await getForm();
  fs.writeFile(__dirname + '/../data/form.json', JSON.stringify(form), err => {
    if (err) throw err;
    console.log('The form has been saved!');
  });
  return form;
};

module.exports = saveForm;
