const Router = require('koa-router')
const fetch = require('cross-fetch')
const request = require('request')
require('dotenv').config()

const {
  verifyToken,
  startSurvey,
  receiveMessage,
} = require('./controller')

const conf = require('../private/conf.json')
const typeformToken = conf.tokens.typeform

const router = new Router()

router.get('/webhooks', verifyToken)
// router.post('/webhooks', receiveMessage);
router.post('/webhooks', startSurvey);


module.exports = router
