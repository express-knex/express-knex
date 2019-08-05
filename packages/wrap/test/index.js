import { expect } from 'chai'
import Wrap from '../src'

describe('Storage test', () => {
  it('should have all keys', () => {
    const app = {}
    app.wrap = Wrap(app)
    expect(app).to.include.keys('wrap')
    expect(app.wrap).to.be.a('function')
  })
})
