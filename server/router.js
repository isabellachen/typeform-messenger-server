const Router = require('koa-router');
require('dotenv').config();

const { verifyToken } = require('./services');
const { startSurvey } = require('./controllers');

const router = new Router();

router.get('/webhooks', verifyToken);
router.post('/webhooks', startSurvey);

module.exports = router;
