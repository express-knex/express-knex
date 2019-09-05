import chai, { expect } from 'chai'
import dirtyChai from 'dirty-chai'
import RouteBuilder from '../src'
import Errors from '@express-knex/errors'
import Validator from '@express-knex/validator'
import express from 'express'
import Wrap from '@express-knex/wrap'

chai.use(dirtyChai)

describe('Controller package test', () => {
  it('Property test', () => {
    const app = { env: {} }
    app.wrap = Wrap(app)
    app.errors = Errors(app)
    app.validator = Validator(app)
    app.express = express
    app.models = {}
    app.routeBuilder = RouteBuilder(app)
    expect(app.routeBuilder).to.not.undefined()
    expect(app.routeBuilder).to.not.null()
    expect(app.routeBuilder).to.include.keys(
      'routerForModel',
      'routerForAllModels')
    expect(app.routeBuilder.routerForModel).to.be.a('function')
    expect(app.routeBuilder.routerForAllModels).to.be.a('function')
  })
})
