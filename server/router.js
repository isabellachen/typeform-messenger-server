const Router = require('koa-router')
const fetch = require('cross-fetch')
const request = require('request')
require('dotenv').config()

const {receiveMessage, verifyToken} = require('./controller')
const conf = require('../private/conf.json')
const typeformToken = conf.tokens.typeform

const router = new Router()

router.get('/webhooks', verifyToken)
router.post('/webhooks', receiveMessage);

router.get('/forms/:formId', async (ctx) => {
  const form = await fetch(`https://api.typeform.com/forms/${ctx.params.formId}`, {
    headers: {
      "Authorization": `bearer ${typeformToken}`
    }
  }).then(res => res.json())
  ctx.body = form.fields
  ctx.status = 200
})

module.exports = router
