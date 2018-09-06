require('dotenv').config();

const verifyToken = ctx => {
  if (ctx.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    ctx.body = ctx.query['hub.challenge'];
    ctx.status = 200;
  } else {
    ctx.body = 'invalid verify token';
    ctx.status = 401;
  }
};

module.exports = { verifyToken };
