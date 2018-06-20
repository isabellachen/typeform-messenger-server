const translateWelcomeScreen = (data) => {
  let response = {}
  response.text = data.title
  response.quick_replies = [
    {
      content_type: "text",
      title: data.properties.button_text,
      payload: "start",
    }
  ]
  return response
}

const translateShortText = (question) => {
  return {text: question.title}
}

const translateMultipleChoice = (question) => {
  //translate TF multiple choice to FB template with buttons
  let response = {}
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
  translateMultipleChoice,
}