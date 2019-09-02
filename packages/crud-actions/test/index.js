import chai, { expect } from 'chai'
import dirtyChai from 'dirty-chai'
import Controller from '@express-knex/controller'
import Validator from '@express-knex/validator'
import Errors from '@express-knex/errors'
import CrudActions from '../src/index'

chai.use(dirtyChai)

describe('Crud-actions', () => {
  it('Property test', () => {
    const app = { env: {} }
    app.errors = Errors(app)
    app.validator = Validator(app)
    app.controller = Controller(app)
    app.controller.CrudActions = CrudActions(app)
    expect(app.controller).to.not.undefined()
    expect(app.controller).to.not.null()
    expect(app.controller.CrudActions).to.be.a('array')
  })
})
