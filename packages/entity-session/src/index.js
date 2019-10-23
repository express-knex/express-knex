import uuid from 'uuid/v4'
import _ from 'lodash'

const packageName = 'Entity-session package'

/* Session:
  * id: <UUID> session identifier, UUID
  * userId: <User> user, associated with this login
  * createdAt: <date> date of logging-in
  * ip: <string> IP address of user's endpoint
*/

export default module.exports = (app) => {
  if (!app.storage) {
    throw Error(`${packageName}: expect app.storage to be mounted`)
  }

  if (!app.storage.processBeforeSaveToStorage || !app.storage.processAfterLoadFromStorage) {
    throw Error(`${packageName}: expect app.storage to have mounted functions`)
  }

  if (!app.controller || !app.controller.CrudActions) {
    throw Error(`${packageName}: app.controller.CrudActions should be initialized`)
  }

  const Model = {
    name: 'Session',
    priority: 0,
    props: [
      {
        name: 'id',
        type: 'id',
        default: () => uuid()
      },
      {
        name: 'userId',
        type: 'ref',
        default: null
      },
      {
        name: 'createdAt',
        type: 'datetime',
        default: () => Date.now()
      },
      {
        name: 'ip',
        type: 'text',
        default: null
      }
    ],
  }

  Model.app = app

  // define model methods
  Model.processBeforeSaveToStorage = app.storage.processBeforeSaveToStorage(Model)
  Model.processAfterLoadFromStorage = app.storage.processAfterLoadFromStorage(Model)

  Model.storageSchemaInit = app.storage.storageSchemaInit(Model)
  Model.storageSchemaClear = app.storage.storageSchemaClear(Model)

  Model.storageDataInit = app.storage.storageDataInit(Model)
  Model.storageDataClear = app.storage.storageDataClear(Model)

  Model.storageRefsInit = app.storage.storageRefsInit(Model)
  Model.storageRefsClear = app.storage.storageRefsClear(Model)

  Model.findById = app.storage.findById(Model)
  Model.findOne = app.storage.findOne(Model)
  Model.findAll = app.storage.findAll(Model)
  Model.count = app.storage.count(Model)
  Model.removeById = app.storage.removeById(Model)
  Model.removeAll = app.storage.removeAll(Model)
  Model.create = app.storage.create(Model)
  Model.update = app.storage.update(Model)
  Model.createOrUpdate = (item) => {
    return Model.findOne({ where: { userId: item.userId, ip: item.ip } })
      .then((res) => {
        if (!res) {
          return Model.create(item)
        } else {
          _.assign(item, res)
          item.createdAt = Date.now()
          item.id = res.id
          return Model.update(item)
        }
      })
  }

  // define routes (published methods)
  Model.actions = app.controller.CrudActions(Model)
  if (!app.meta) {
    app.meta = {}
  }
  app.meta.actions = app.actions.concat(Model.actions)

  return Model
}
