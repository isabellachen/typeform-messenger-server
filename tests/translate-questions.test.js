const mocha = require('mocha')
const chai = require('chai').should()
const mocks = require('./mocks/mocks-form')
const translateFunctions = require('../server/functions/translate-functions')
const { 
  translateWelcomeScreen,
  translateShortText,
  translateStatement,
  translateMultipleChoice,
 } = translateFunctions

describe('should translate the welcome screen', () => {
  const data = mocks.welcome_screens[0]
  const translated = translateWelcomeScreen(data)
  it('should be an object', () => {
    translated.should.be.an('object')
  })
  it('should have a text property with the title of the welcome screen', () => {
    translated.should.have.property('text', data.title)
  })
  it('should have a quick_replies property of type array', () => {
    translated.quick_replies.should.be.an('array')
  })
  it('quick_replies should have at least one element in it', () => {
    translated.quick_replies.should.not.be.empty
  })
  it('quick_replies should contain objects with properties of content_type, title and payload', () => {
    translated.quick_replies.forEach(reply => {
      reply.should.have.property('content_type', 'text')
      reply.should.have.property('title')
      reply.should.have.property('payload', data.properties.button_text)
    })
  })
})

describe('should translate short text questions', () => {
  const shortTextQuestion = mocks.fields.filter(question => {
    return question.type === "short_text"
  })[0]

  const question = translateShortText(shortTextQuestion)
  it('should be an object', () => {
    question.should.be.an('object')
  })
  it('should have a text property that is the Typeform question', () => {
    question.should.have.property('text', shortTextQuestion.title)
  })
})

describe('should translate statement questions', () => {
  const statementQuestion = mocks.fields.filter(question => {
    return question.type === "statement"
  })[0]

  const question = translateStatement(statementQuestion)
  it('should be an object', () => {
    question.should.be.an('object')
  })

  it('should have a text property that is the Typeform question', () => {
    question.should.have.property('text', statementQuestion.title)
  })
})

describe('should translate multiple choice questions', () => {

  const multipleChoiceQuestion = mocks.fields.filter(question => {
    return question.type === "multiple_choice"
  })[0]

  const question = translateMultipleChoice(multipleChoiceQuestion)

  it('should be an object', () => {
    question.should.be.an('object')
  })
  it('should not have a text property', () => {
    question.should.have.property('text')
  })
  it('should have an attachment property', () => {
    question.should.have.property('attachment')
  })
  it('should have an attachment property of "type" : template', () => {
    question.attachment.should.have.property('type', 'template')
  })
  it('should have an attachment property "payload"', () => {
    question.attachment.should.have.property('payload')
  })
  it('should have a payload with property of "template_type" : button', () => {
    question.attachment.payload.should.have.property('template_type', 'button')
  })
  it('should have a payload with property of "text" as the question title', () => {
    question.attachment.payload.should.have.property('text', multipleChoiceQuestion.title)
  })
  it('should have a payload with property of buttons that is an array', () => {
    question.attachment.payload.buttons.should.be.an('array')
  })
  it('should have buttons with type, title and payload ', () => {
    question.attachment.payload.buttons.forEach(button => {
      button.should.have.property('type','postback')
      button.should.have.property('title')
      button.should.have.property('payload')
    })
  })

})