const packageName = 'Route-builder package'

export default (app) => {
  if (!app.errors) {
    throw Error(`${packageName}: expect app.errors to be mounted with proper error classes`)
  }

  if (!app.errors.ServerError || !app.errors.ServerGenericError ||
    !app.errors.ServerInvalidParameters || !app.errors.ServerNotFound) {
    throw Error(`${packageName}: can not find expected error classes at app.errors`)
  }

  if (!app.validator) {
    throw Error(`${packageName}: expect app.validator to be mounter`)
  }
  if (!app.validator.validatorFromModel) {
    throw Error(`${packageName}: expect app.validator.validatorFromModel`)
  }

  if (!app.models) {
    throw Error(`${packageName}: app.models should exist`)
  }

  if (!app.express) {
    throw Error(`${packageName}: app.express should exist and provide Express instance`)
  }

  if (!app.wrap) {
    throw Error(`${packageName}: app.wrap should exist`)
  }

  const routerForModel = (model) => {
    if (model && model.actions) {
      model.actions.map((action) => {
        switch (action.method) {
          case 'GET':
            app.get(action.path, app.wrap(action.handler))
            break
          case 'POST':
            app.post(action.path, app.wrap(action.handler))
            break
          case 'PUT':
            app.put(action.path, app.wrap(action.handler))
            break
          case 'DELETE':
            app.delete(action.path, app.wrap(action.handler))
            break
          case 'ALL':
            app.all(action.path, app.wrap(action.handler))
            break
        }
      })
    }
  }

  const routerForAllModels = () => {
    // if (!router) {
    //   router = app.express.Router()
    // }

    const keys = Object.keys(app.models)
    keys.map((modelName) => {
      const model = app.models[modelName]
      if (model && model.actions) {
        routerForModel(model)
      }
    })
  }

  return {
    routerForModel,
    routerForAllModels
  }
}
