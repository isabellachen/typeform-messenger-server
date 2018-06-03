const fs = require('fs')
const util = require('util')
const fetch = require('cross-fetch')
require('dotenv').config()

const conf = require('../../private/conf.json')
const typeformToken = conf.tokens.typeform

const writeFile = util.promisify(fs.writeFile)

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
  await writeFile(__dirname + '/../data/questions.json', JSON.stringify(form))
  return form
}


module.exports = saveForm