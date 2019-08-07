
export default (app) => {
  const Errors = {}

  Errors.ServerError = class ServerError extends Error {
  }

  Errors.ServerInvalidParameters = class ServerInvalidParameters extends Errors.ServerError {
    constructor (paramName, paramType, message) {
      super(message)
      this.paramName = paramName
      this.paramType = paramType
    }
  }

  Errors.ServerInvalidParams = class ServerInvalidParams extends Errors.ServerError {
    constructor (errors) {
      super('Validation of params failed')
      this.errors = errors
    }
  }

  Errors.ServerInvalidUsernamePassword = class ServerInvalidUsernamePassword extends Errors.ServerError {}
  Errors.ServerNotAllowed = class ServerNotAllowed extends Errors.ServerError {}

  Errors.ServerGenericError = class ServerGenericError extends Errors.ServerError {
    constructor (error) {
      super(error.message)
      this.error = error
    }
  }

  Errors.ServerNotFound = class ServerNotFound extends Errors.ServerError {
    constructor (resource, id, message) {
      super(message)
      this.resource = resource
      this.id = id
    }
  }

  return Errors
}
