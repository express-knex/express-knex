const packageName = 'Route-builder package'

const getMethod = (methodName, router) => {
  let httpMethod = null
  switch (methodName) {
    case 'GET':
      httpMethod = router.get
      break
    case 'POST':
      httpMethod = router.post
      break
    case 'PUT':
      httpMethod = router.put
      break
    case 'DELETE':
      httpMethod = router.delete
      break
    case 'ALL':
      httpMethod = router.all
      break
  }
  return httpMethod
}

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
        const httpMethod = getMethod(action.method, app)
        if (httpMethod) {
          httpMethod(action.path, app.wrap(action.handler))
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
