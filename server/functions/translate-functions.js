const translateWelcomeScreen = (data) => {
  const response = {}
  response.text = data.title
  response.quick_replies = [
    {
      content_type: "text",
      title: data.properties.button_text,
      payload: data.properties.button_text,
    }
  ]
  return response
}

const translateShortText = (question) => {
  return {text: question.title}
}

const translateStatement = (question) => {
  //translate TF statement tp FB quick reply
  const response = {}
  response.text = question.title //fix to account for dynamic {{field}} in question tite
  //regex question.title, check if there is a {{field}} and look in answers to see if there is a question-answer pair with the field
  response.quick_replies = [
    {
      content_type: "text",
      title: question.properties.button_text,
      payload: question.properties.button_text,
    }
  ]
  return response
}

const translateMultipleChoice = (question) => {
  //translate TF multiple choice to FB template with buttons
  const response = {}
  const choices = question.properties.choices.map(choice => {
    return {
      type: 'postback',
      title: choice.label,
      payload: choice.label
    }
  })
  response.attachment = {
    type: 'template',
    payload: {
      template_type: 'button',
      text: question.title,
      buttons: choices
    }
  }
  return response
}

module.exports = {
  translateWelcomeScreen,
  translateShortText,
  translateStatement,
  translateMultipleChoice,
}