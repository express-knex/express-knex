import chai, { expect } from 'chai'
import dirtyChai from 'dirty-chai'
import Auth from '../src'
import Storage from '@express-knex/storage-sqlite'
import Errors from '@express-knex/errors'
import Validator from '@express-knex/validator'
import Controller from '@express-knex/controller'
// import CrudActions from '@express-knex/crud-actions'
import User from '@express-knex/entity-user'
import Session from '@express-knex/entity-session'

chai.use(dirtyChai)

describe('Entity-user', () => {
  it('Property test', () => {
    const app = { env: {} }
    app.errors = Errors(app)
    app.validator = Validator(app)
    app.storage = Storage(app)
    app.controller = Controller(app)
    app.models.User = User(app)
    app.models.Session = Session(app)
    app.auth = Auth(app)
    expect(app.auth).to.not.undefined()
    expect(app.auth).to.not.null()
    expect(app.auth).to.include.keys(
      'encode',
      'getTokenFromReq',
      'check')
    expect(app.auth.encode).to.be.a('function')
    expect(app.auth.getTokenFromReq).to.be.a('function')
    expect(app.auth.check).to.be.a('function')
  })
})
