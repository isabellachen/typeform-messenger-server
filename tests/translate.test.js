const mocha = require('mocha')
const chai = require('chai').should()
const mocks = require('./mocks/mocks-form')
const translateFunctions = require('../server/functions/translate-functions')
const { translateWelcomeScreen } = translateFunctions

describe('should translate the welcome screen', () => {
  const data = mocks.welcome_screens[0]
  const translated = translateWelcomeScreen(data)
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
      reply.should.have.property('content_type')
      reply.should.have.property('title')
      reply.should.have.property('payload')
    })
  })
})