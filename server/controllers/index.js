const { handleMessage, handlePostback } = require('./messageHandler');

const startSurvey = async ctx => {
  try {
    console.log('body: ', ctx.request.body);
    const body = ctx.request.body;

    if (body.object === 'page') {
      body.entry.forEach(entry => {
        let event;
        event = entry.messaging[0];
        if (event.message) {
          console.log('event.message: ', event.message);
          handleMessage(event);
        } else if (event.postback && event.postback.payload) {
          console.log('event.postback: ', event.postback);
          handlePostback(event);
        }
        ctx.status = 200;
      });
    } else {
      ctx.status = 404;
    }
  } catch (error) {
    console.error('[ERR] startSurvey: ', error);
  }
};

console.log(handleMessage('fooo'));

module.exports = { startSurvey, translatedForm, counter, answers };
