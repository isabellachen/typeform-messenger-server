const Koa = require('koa')
const bodyParser = require('koa-bodyparser')

const router = require('./router') 

const app = new Koa()

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000, () => console.log('koa app listening on port 3000'))