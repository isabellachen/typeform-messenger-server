const Koa = require('koa')

const router = require('./router') 

const app = new Koa()

app.use(router())

app.listen(3000, () => console.log('koa app listening on port 3000'))