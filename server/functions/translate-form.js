const translateFunctions = require('./translate-functions')
const { translateWelcomeScreen,
        translateShortText,
        translateMultipleChoice,
      } = translateFunctions

const translateForm = (data) => {

  const welcomeScreen = []
  if (data.welcome_screens) {
    const welcome = data.welcome_screens[0]
    let response = {
      response: translateWelcomeScreen(welcome),
      type: 'welcome_screen',
      ref: welcome.ref,
    }
    welcomeScreen.push(response)
  }

  const translatedQuestions = data.fields.map(question => {
    const response = {} 
    if (question.type === 'short_text') {
      return {
        response: translateShortText(question),
        type: question.type,
        ref: question.ref,
      }
    }
    if (question.type === 'multiple_choice') {
      return {
        response: translateMultipleChoice(question),
        type: question.type,
        ref: question.ref,
      }
    }
    if (question.type === 'email') {
      response.text = question.title
      return response //to be deleted
    }
    if (question.type === 'picture_choice') {
      response.text = question.title
      return response //to be deleted
    }
    if (question.type === 'long_text') {
      response.text = question.title
      return response //to be deleted
    }
  })
  const translatedForm = [
    ...welcomeScreen, 
    ...translatedQuestions
  ]

  return translatedForm
}


module.exports = translateForm