const translateQuestions = (questions) => {
  const translated = questions.map(question => {
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
      // response.text = question.title
      return response
    }
    if (question.type === 'email'){
      response.text = question.title
      return response
    } 
    if (question.type === 'picture_choice'){
      response.text = question.title
      return response
    } 
    if (question.type === 'long_text'){
      response.text = question.title
      return response
    } 
  })
  return translated
}

module.exports = translateQuestions