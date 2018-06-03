const fs = require('fs')
const fetch = require('cross-fetch')
require('dotenv').config()

const conf = require('../../private/conf.json')
const typeformToken = conf.tokens.typeform

const getForm = async () => {
  const form = await fetch(`https://api.typeform.com/forms/${process.env.FORM_ID}`, {
    headers: {
      "Authorization": `bearer ${typeformToken}`
    }
  }).then(res => res.json())
  const fields = form.fields
  return fields
}

const saveForm = async () => {
  const form = await getForm()
  fs.writeFile(__dirname + '/../data/questions.json', JSON.stringify(form), (e) => {
    if (e) console.error('error writing to questions.json', e)
    else console.log('form fields were saved')
  })
}


module.exports = saveForm