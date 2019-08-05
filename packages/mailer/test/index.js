import chai, { expect } from 'chai'
import dirtyChai from 'dirty-chai'
import Mailer from '../src'

chai.use(dirtyChai)

describe('Mailer package test', () => {
  it('Property test', () => {
    const app = { env: {} }
    app.env.MAIL_API_KEY = '123'
    app.mail = Mailer(app)
    expect(app).to.include.keys('mail')
    expect(app.mail).to.not.undefined()
    expect(app.mail).to.not.null()
    expect(app.mail).to.be.a('function')
  })
})
