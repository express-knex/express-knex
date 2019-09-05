import chai, { expect } from 'chai'
import dirtyChai from 'dirty-chai'
import RouteBuilder from '../src'
import Errors from '@express-knex/errors'
import Validator from '@express-knex/validator'
import express from 'express'
import Wrap from '@express-knex/wrap'
import User from '@express-knex/entity-user'
import Storage from '@express-knex/storage-sqlite'
import Controller from '@express-knex/controller'
import CrudActions from '@express-knex/crud-actions'

chai.use(dirtyChai)

describe('Route-builder', () => {
  it('Property test', () => {
    const app = express()
    app.wrap = Wrap(app)
    app.errors = Errors(app)
    app.validator = Validator(app)
    app.storage = Storage(app)
    app.controller = Controller(app)
    app.controller.CrudActions = CrudActions(app)
    app.express = express
    app.models = {}
    app.models.User = User(app)
    app.routeBuilder = RouteBuilder(app)
    app.routeBuilder.routerForAllModels()

    expect(app.routeBuilder).to.not.undefined()
    expect(app.routeBuilder).to.not.null()
    expect(app.routeBuilder).to.include.keys(
      'routerForModel',
      'routerForAllModels')
    expect(app.routeBuilder.routerForModel).to.be.a('function')
    expect(app.routeBuilder.routerForAllModels).to.be.a('function')
  })
})
