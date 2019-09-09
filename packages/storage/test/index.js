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
      'storageInit',
      'storageClose',
      'storageSchemaInit',
      'storageSchemaClear',
      'storageDataInit',
      'storageDataClear',
      'storageRefsInit',
      'storageRefsClear',
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
