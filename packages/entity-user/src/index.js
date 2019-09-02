import uuid from 'uuid/v4'
import bcrypt from 'bcrypt'
import CrudActions from '@express-knex/crud-actions'

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

  Model.initData = app.storage.init(Model)
  Model.clearData = app.storage.clearData(Model)

  // storageSchemaInit: create a persistent scheme in storage to accept model entities
  // storageSchemaClear: remove schema from storage completely including data
  // storageDataInit: seed some dataset into storage, if no name - seed system data (if any)
  // storageDataClear: make storage empty and remove all model's entites from storage
  // storageRefsInit: add storage reference integrity checks and indexes
  // storageRefsClear: remove any reference integrity checks and indexes from storage

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
  Model.actions = CrudActions(Model)

  return Model
}
