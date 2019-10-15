import uuid from 'uuid/v4'
import bcrypt from 'bcrypt'

const packageName = 'Entity-user package'

/* User:
  * id: user identifier, UUID
  * name:
  * email: email, that user choose for registering
  * password: hashed password
  * invitedBy: -> User.id: user that created invite
  * inviteDate: date of invite
  * inviteId -> Invite.id: link to invite
  * disabled: if user account is disabled
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
    name: 'User',
    priority: 0,
    props: [
      {
        name: 'id',
        type: 'id',
        default: () => uuid()
      },
      {
        name: 'name',
        type: 'text',
        default: null
      },
      {
        name: 'email',
        type: 'email',
        default: null
      },
      {
        name: 'password',
        type: 'password',
        default: null,
        beforeSave: (item) => bcrypt.hashSync(item.password, bcrypt.genSaltSync())
      },
      {
        name: 'invitedBy',
        type: 'ref',
        default: null
      },
      {
        name: 'inviteDate',
        type: 'datetime',
        default: null
      },
      {
        name: 'inviteId',
        type: 'ref',
        default: null
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: false
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
  Model.isPassword = (encodedPassword, password) => bcrypt.compareSync(password, encodedPassword)

  // define routes (published methods)
  Model.actions = app.controller.CrudActions(Model)
  if (!app.meta) {
    app.meta = {}
  }
  app.meta.actions = app.actions.concat(Model.actions)

  return Model
}
