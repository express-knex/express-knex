import chai, { expect } from 'chai'
import dirtyChai from 'dirty-chai'
import CrudActions from '../src'
import Errors from '@express-knex/errors'
import Validator from '@express-knex/validator'
import Controller from '@express-knex/controller'
chai.use(dirtyChai)

describe('Entity-user', () => {
  it('Property test', () => {
    const app = { env: {} }
    app.errors = Errors(app)
    app.validator = Validator(app)
    app.controller = Controller(app)
    app.controller.CrudActions = CrudActions(app)
    expect(app.controller).to.not.undefined()
    expect(app.controller).to.not.null()
    expect(app.controller).to.include.keys(
      'list',
      'create',
      'item',
      'save',
      'remove',
      'removeAll')
    expect(app.controller.list).to.be.a('function')
    expect(app.controller.create).to.be.a('function')
    expect(app.controller.item).to.be.a('function')
    expect(app.controller.save).to.be.a('function')
    expect(app.controller.remove).to.be.a('function')
    expect(app.controller.removeAll).to.be.a('function')
  })
})
