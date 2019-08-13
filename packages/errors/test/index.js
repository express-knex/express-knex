import { describe, it } from 'mocha'
import chai, { expect } from 'chai'
import Errors from '../src/index'
import dirtyChai from 'dirty-chai'

chai.use(dirtyChai)

describe('Error test', () => {
  it('Proper errors object should be mounted on app', () => {
    const app = {}
    app.errors = Errors(app)

    expect(app.errors).to.not.undefined()
    expect(app.errors).to.not.null()
    expect(app.errors).to.include.keys(
      'ServerError',
      'ServerInvalidParameters',
      'ServerInvalidUsernamePassword',
      'ServerNotAllowed',
      'ServerGenericError',
      'ServerNotFound')
    expect(app.errors.ServerError).to.be.a('function')
  })
})
