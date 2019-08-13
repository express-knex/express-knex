export default (app) => {
  if (!app.errors) {
    throw Error('Controller package: expect app.errors to be mounted with proper error classes')
  }
  if (!app.errors.ServerError || !app.errors.ServerGenericError ||
    !app.errors.ServerInvalidParameters || !app.errors.ServerNotFound) {
    throw Error('Controller package can not find expected error classes at app.errors')
  }

  if (!app.validator) {
    throw Error('Controller package: expect app.validator to be mounter')
  }
  if (!app.validator.validatorFromModel) {
    throw Error('Controller package: expect app.validator.validatorFromModel')
  }

  const Controller = {
    list: (Model) => (req, res) => {
      // no params or input objects
      return Promise.all([Model.findAll(), Model.count()])
        .then((data) => {
          const foundData = data[0]
          const count = data[1]
          // if (!foundData) {
          //   console.log('Data not found')
          //   console.log(foundData)
          // }
          // if (!count) {
          //   console.log('Count failed:')
          //   console.log(count)
          // }
          // console.log('res:')
          // console.log(res)
          res.set('Content-Range', `${Model.name} 0-${count}/${count}`)
          res.json(foundData)
          return foundData
        })
        .catch((error) => {
          if (error instanceof app.errors.ServerError) {
            throw error
          } else {
            console.log(error)
            throw new app.errors.ServerGenericError(error)
          }
        })
    },

    create: (Model) => (req, res) => {
      // validate that body have proper object without ID:
      const validations = app.validator.validatorFromModel(Model)

      // perform create instance:
      return app.validator.applyValidationsToReq(validations, req)
        .then(() => Model.create(req.matchedData))
        .then((item) => {
          res.json(item)
          return item
        })
        .catch((error) => {
          if (error instanceof app.errors.ServerError) {
            throw error
          } else {
            throw new app.errors.ServerGenericError(error)
          }
        })
    },

    item: (Model) => (req, res) => {
      // validate that req have id param

      return Model.findById(req.params.id)
        .then((foundData) => {
          if (!foundData) {
            throw app.errors.ServerNotFound(Model.name, req.params.id, `${Model.name} with id ${req.params.id} not found`)
          }
          res.json(foundData)
          return foundData
        })
        .catch((error) => {
          if (error instanceof app.errors.ServerError) {
            throw error
          } else {
            throw new app.errors.ServerGenericError(error)
          }
        })
    },

    save: (Model) => (req, res) => {
      // validate that body have properly shaped object:

      // console.log('body:')
      // console.log(req.body)
      // console.log('matchedData:')
      // console.log(req.matchedData)
      req.matchedData.id = req.params.id
      const validations = app.validator.validatorFromModel(Model)

      // perform create instance:
      return app.validator.applyValidationsToReq(validations, req)
        .then(() => Model.update(req.matchedData))
        .then((foundData) => {
          res.json(foundData)
          return foundData
        })
        .catch((error) => {
          if (error instanceof app.errors.ServerError) {
            throw error
          } else {
            throw new app.errors.ServerGenericError(error)
          }
        })
    },

    remove: (Model) => (req, res) => {
      // check for id:

      return Model.removeById(req.params.id)
        .then((foundData) => {
          if (foundData) {
            res.json(foundData)
            return foundData
          }
          throw new app.errors.ServerNotFound(Model.name, req.params.id, `${Model.name} with id ${req.params.id} not found`)
        })
    },

    removeAll: (Model) => (req, res) => {
      // console.log('generic-controller.genericDeleteAll:')
      // console.log('query.filter')
      // console.log(req.query.filter)
      // console.log(req.query.filter.ids)

      req.qs = JSON.parse(req.query.filter)
      // console.log(req.qs)
      if (!(req.qs && req.qs.ids)) {
        throw new app.errors.ServerInvalidParameters(
          'filter', 'query parameter',
          'filter query parameter should exists and have ids property')
      }
      return Model.removeAll({ whereIn: { column: Model.key, ids: req.qs.ids } })
        .then((foundData) => {
          if (foundData) {
            res.json(foundData)
            return foundData
          }
          throw new app.errors.ServerError('Not found - ids')
        })
        .catch((error) => {
          if (error instanceof app.errors.ServerError) {
            throw error
          } else {
            throw new app.errors.ServerGenericError(error)
          }
        })
    }
  }
  return Controller
}
