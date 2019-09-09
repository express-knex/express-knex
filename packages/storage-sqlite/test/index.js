import { expect } from 'chai'
import Storage from '../src'

describe('Storage test', () => {
  it('should have all Storage keys', () => {
    const app = Storage({})
    expect(app).to.include.keys('db', 'name',
      'processBeforeSaveToStorage',
      'processAfterLoadFromStorage',
      'mapPropToKnexTable',
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
