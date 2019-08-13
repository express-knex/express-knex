import chai, { expect } from 'chai'
import dirtyChai from 'dirty-chai'
import Validator from '../src'
import Errors from '@express-knex/errors'
chai.use(dirtyChai)

describe('Controller package test', () => {
  it('Property test', () => {
    const app = { env: {} }
    app.errors = Errors(app)
    app.validator = Validator(app)
    expect(app.validator).to.not.undefined()
    expect(app.validator).to.not.null()
    expect(app.validator).to.include.keys(
      'validatorFromModel',
      'applyValidationsToReq')
    expect(app.validator.validatorFromModel).to.be.a('function')
    expect(app.validator.applyValidationsToReq).to.be.a('function')
  })
})
