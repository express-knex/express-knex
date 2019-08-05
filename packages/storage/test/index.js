import { expect } from 'chai'
import Storage from '../src'

describe('Storage test', () => {
  it('should have all Storage keys', () => {
    const app = Storage({})
    expect(app).to.include.keys(
      'db',
      'name')
    expect(app).to.include.keys(
      'processBeforeSaveToStorage',
      'processAfterLoadFromStorage',
      'mapPropToKnexTable')
    expect(app).to.include.keys(
      'initStorage',
      'closeStorage',
      'init',
      'findById',
      'findOne',
      'findAll',
      'count',
      'removeById',
      'removeAll',
      'create',
      'update')
  })
})
