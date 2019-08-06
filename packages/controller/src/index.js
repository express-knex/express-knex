import { ServerError, ServerGenericError, ServerInvalidParameters, ServerNotFound } from './errors'

export default (app) => {
  const Controller = {
    list: (Model) => (req, res) => {
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
          if (error instanceof ServerError) {
            throw error
          } else {
            console.log(error)
            throw new ServerGenericError(error)
          }
        })
    },

    create: (Model) => (req, res) => {
      return Model.create(req.matchedData)
        .then((item) => {
          res.json(item)
          return item
        })
        .catch((error) => {
          if (error instanceof ServerError) {
            throw error
          } else {
            throw new ServerGenericError(error)
          }
        })
    },

    item: (Model) => (req, res) => {
      return Model.findById(req.params.id)
        .then((foundData) => {
          if (!foundData) {
            throw ServerNotFound(Model.name, req.params.id, `${Model.name} with id ${req.params.id} not found`)
          }
          res.json(foundData)
          return foundData
        })
        .catch((error) => {
          if (error instanceof ServerError) {
            throw error
          } else {
            throw new ServerGenericError(error)
          }
        })
    },

    save: (Model) => (req, res) => {
      // console.log('body:')
      // console.log(req.body)
      // console.log('matchedData:')
      // console.log(req.matchedData)
      req.matchedData.id = req.params.id
      return Model.update(req.matchedData)
        .then((foundData) => {
          res.json(foundData)
          return foundData
        })
        .catch((error) => {
          if (error instanceof ServerError) {
            throw error
          } else {
            throw new ServerGenericError(error)
          }
        })
    },

    remove: (Model) => (req, res) => {
      return Model.removeById(req.params.id)
        .then((foundData) => {
          if (foundData) {
            res.json(foundData)
            return foundData
          }
          throw new ServerNotFound(Model.name, req.params.id, `${Model.name} with id ${req.params.id} not found`)
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
        throw new ServerInvalidParameters(
          'filter', 'query parameter',
          'filter query parameter should exists and have ids property')
      }
      return Model.removeAll({ whereIn: { column: Model.key, ids: req.qs.ids } })
        .then((foundData) => {
          if (foundData) {
            res.json(foundData)
            return foundData
          }
          throw new ServerError('Not found - ids')
        })
        .catch((error) => {
          if (error instanceof ServerError) {
            throw error
          } else {
            throw new ServerGenericError(error)
          }
        })
    }
  }
  return Controller
}
