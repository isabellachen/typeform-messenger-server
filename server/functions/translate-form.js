const {
  translateWelcomeScreen,
  translateThankYouScreen,
  translateShortText,
  translateMultipleChoice,
  translateEmail,
  translatePictureChoice,
  translateLongText
} = require('typeform-to-facebook-messenger');

const translateForm = data => {
  const welcomeScreen = [];
  const thankYouScreen = [];

  if (data.welcome_screens) {
    const welcome = data.welcome_screens[0];
    let response = {
      response: translateWelcomeScreen(welcome),
      type: 'welcome_screen',
      ref: welcome.ref
    };
    welcomeScreen.push(response);
  }

  if (data.thankyou_screens) {
    const thankYou = data.thankyou_screens[0];
    let response = {
      response: translateThankYouScreen(thankYou),
      type: 'thankyou_screen',
      ref: thankYou.ref
    };
    thankYouScreen.push(response);
  }

  const translatedQuestions = data.fields.map(question => {
    const response = {};
    if (question.type === 'short_text') {
      return {
        response: translateShortText(question),
        type: question.type,
        ref: question.ref
      };
    }
    if (question.type === 'multiple_choice') {
      return {
        response: translateMultipleChoice(question),
        type: question.type,
        ref: question.ref
      };
    }
    if (question.type === 'email') {
      question.title = question.title.split(',')[1]; //TODO: quick fix for email field
      return {
        response: translateEmail(question),
        type: question.type,
        ref: question.ref
      };
    }
    if (question.type === 'picture_choice') {
      return {
        response: translatePictureChoice(question),
        type: question.type,
        ref: question.ref
      };
    }
    if (question.type === 'long_text') {
      return {
        response: translateLongText(question),
        type: question.type,
        ref: question.ref
      };
    }
  });

  const translatedForm = [
    ...welcomeScreen,
    ...translatedQuestions,
    ...thankYouScreen
  ];

  return translatedForm;
};

module.exports = translateForm;
