import chai, { expect } from 'chai'
import dirtyChai from 'dirty-chai'
import Controller from '../src'

chai.use(dirtyChai)

describe('Controller package test', () => {
  it('Property test', () => {
    const app = { env: {} }
    app.controller = Controller(app)
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
