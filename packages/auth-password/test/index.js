import chai, { expect } from 'chai'
import dirtyChai from 'dirty-chai'
import AuthPw from '../src'

chai.use(dirtyChai)

describe('Entity-user', () => {
  it('Property test', () => {
    const app = { env: {} }
    app.meta = {}
    AuthPw(app)
    expect(app.meta).to.be.a('object')
    expect(app.meta.actions).to.be.a('array')
    expect(app.meta.actions).to.have.lengthOf(1)
    expect(app.meta.actions[0].name).to.be.equal('Auth.Password.Login')
  })
})
