const Router = require('koa-router')
const fetch = require('cross-fetch')

const conf = require('../private/conf.json')
const typeformToken = conf.tokens.typeform

const router = new Router()

router.get('/forms/:formId', async (ctx) => {
  const form = await fetch(`https://api.typeform.com/forms/${ctx.params.formId}`, {
    headers: {
      "Authorization": `bearer ${typeformToken}`
    }
  })
})
