import chai, { expect } from 'chai'
import dirtyChai from 'dirty-chai'
import Validator from '../src'
chai.use(dirtyChai)

describe('Controller package test', () => {
  it('Property test', () => {
    const app = { env: {} }
    app.validator = Validator(app)
    expect(app.validator).to.not.undefined()
    expect(app.validator).to.not.null()
    expect(app.validator).to.include.keys(
      'checkModel')
    expect(app.validator.checkModel).to.be.a('function')
  })
})
