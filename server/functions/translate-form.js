const translateForm = (data) => {
  const welcomeScreen = []
  if (data.welcome_screens) {
    const welcome = data.welcome_screens[0]
    let response = {}
    response.text = welcome.title
    response.quick_replies = [
      {
        content_type: "text",
        title: welcome.properties.button_text,
        payload: "start",
      }
    ]
    welcomeScreen.push(response)
  }
  const translatedQuestions = data.fields.map(question => {
    const response = {}
    if (question.type === 'short_text') {
      response.text = question.title
      return response
    }
    if (question.type === 'multiple_choice') {
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