const translateFunctions = require('./translate-functions')
const { translateWelcomeScreen,
        translateShortText,
        translateMultipleChoice,
      } = translateFunctions

const translateForm = (data) => {

  if (data.welcome_screens) {
    const welcomeScreen = []
    const welcome = data.welcome_screens[0]
    let response = translateWelcomeScreen(welcome)
    welcomeScreen.push(response)
  }

  const translatedQuestions = data.fields.map(question => {
    const response = {}
    if (question.type === 'short_text') {
      return translateShortText(question)
    }
    if (question.type === 'multiple_choice') {
      return translateMultipleChoice(question)
    }
    if (question.type === 'email') {
      response.text = question.title
      return response
    }
    if (question.type === 'picture_choice') {
      response.text = question.title
      return response
    }
    if (question.type === 'long_text') {
      response.text = question.title
      return response
    }
  })
  const translatedForm = [
    ...welcomeScreen, 
    ...translatedQuestions
  ]

  return translatedForm
}

module.exports = translateForm