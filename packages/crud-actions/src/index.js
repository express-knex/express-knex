const packageName = 'Crud-actions package'

export const actionList = (app, Model) => {
  return {
    method: 'GET',
    name: `/${Model.name}.list`,
    description: `Get list of "${Model.name}"`,
    path: `/${Model.name.toLowerCase()}`,
    handler: app.controller.list(Model),
    type: 'Model',
    object: Model
  }
}

export const actionCreate = (app, Model) => {
  return {
    method: 'POST',
    name: `/${Model.name}.create`,
    description: `Create new "${Model.name}"`,
    path: `/${Model.name.toLowerCase()}`,
    handler: app.controller.create(Model),
    validate: {
      body: app.validator.validatorFromModel(Model)
    },
    type: 'Model',
    object: Model
  }
}

export const actionRemoveAll = (app, Model) => {
  return {
    method: 'DELETE',
    name: `/${Model.name}.removeAll`,
    description: `Delete all "${Model.name}"`,
    path: `/${Model.name.toLowerCase()}`,
    handler: app.controller.removeAll(Model),
    type: 'Model',
    object: Model
  }
}

export const actionItem = (app, Model) => {
  return {
    method: 'GET',
    name: `/${Model.name}.item`,
    description: `Get single "${Model.name}" by id`,
    path: `/${Model.name.toLowerCase()}/:id`,
    handler: app.controller.item(Model),
    validate: {
      params: app.validator.paramId
    },
    type: 'Model',
    object: Model
  }
}

export const actionSave = (app, Model) => {
  return {
    method: 'PUT',
    name: `/${Model.name}.item`,
    description: `Save (update) "${Model.name}"`,
    path: `/${Model.name.toLowerCase()}/:id`,
    handler: app.controller.save(Model),
    validate: {
      params: app.validator.paramId,
      body: app.validator.validatorFromModel(Model)
    },
    type: 'Model',
    object: Model
  }
}

export const actionRemove = (app, Model) => {
  return {
    method: 'DELETE',
    name: `/${Model.name}.item`,
    description: `Delete single "${Model.name}" by id`,
    path: `/${Model.name.toLowerCase()}/:id`,
    handler: app.controller.remove(Model),
    validate: {
      params: app.validator.paramId
    },
    type: 'Model',
    object: Model
  }
}

export default (app) => {
  if (!app) {
    throw Error(`${packageName}: expect app to be initialized`)
  }

  if (!app.validator) {
    throw Error(`${packageName}: expect app.validator to be mounted`)
  }
  if (!app.validator.validatorFromModel) {
    throw Error(`${packageName}:  expect app.validator.validatorFromModel`)
  }

  if (!app.controller) {
    throw Error(`${packageName}:  expect app.controller to be mounter`)
  }
  if (!app.controller.list || !app.controller.create || !app.controller.save || !app.controller.remove ||
    !app.controller.removeAll || !app.controller.item) {
    throw Error(`${packageName}: expect app.controller to have proper functions on it (list, create, ... etc)!`)
  }

  const actions = (Model) => {
    return [
      actionList(app, Model),
      actionCreate(app, Model),
      actionRemoveAll(app, Model),
      actionItem(app, Model),
      actionSave(app, Model),
      actionRemove(app, Model)
    ]
  }
  return actions
}
