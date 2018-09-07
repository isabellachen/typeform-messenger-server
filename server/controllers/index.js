const { handleMessage } = require('./messageHandler');

const startSurvey = async ctx => {
  try {
    const body = ctx.request.body;

    if (body.object === 'page') {
      body.entry.forEach(entry => {
        let event;
        event = entry.messaging[0];
        if (event.message || (event.postback && event.postback.payload)) {
          handleMessage(event);
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

module.exports = { startSurvey };
