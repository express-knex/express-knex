import jwt from 'jwt-simple'

const packageName = 'Auth-password package'

export default module.exports = (app) => {
  if (!app.models.User) {
    throw Error(`${packageName}: can not find model "User"`)
  }

  if (!app.models.Session) {
    throw Error(`${packageName}: can not find model "Session"`)
  }
  if (!app.errors) {
    throw Error(`${packageName}: expect app.errors to be mounted with proper error classes`)
  }
  if (!app.errors.ServerInvalidUsernamePassword || !app.errors.ServerNotAllowed ||
    !app.errors.ServerGenericError) {
    throw Error(`${packageName}: can not find expected error classes at app.errors`)
  }

  const User = app.models.User
  const Errors = app.errors
  const Session = app.models.Session

  const login = (req, res) => {
    return User.findOne({ where: { email: req.body.username } })
      .then((user) => {
        if (!user) {
          return Promise.reject(new Errors.ServerInvalidUsernamePassword('Invalid username or password'))
        }

        if (user.disabled) {
          return Promise.reject(new Errors.ServerNotAllowed('User is disabled'))
        }

        // if (!user.emailVerified) {
        //  throw new ServerNotAllowed('Email should be verified')
        // }

        if (!User.isPassword(user.password, req.body.password)) {
          throw new Errors.ServerInvalidUsernamePassword('Invalid username or password') // password error
        }

        return Session.createOrUpdate({ userId: user.id, ip: req.ip })
      })
      .then((session) => {
        res.json({ token: jwt.encode({ id: session.id }, app.env.JWT_SECRET ? app.env.JWT_SECRET : 'jhwckjeqfjnqwdoijed') })

        if (app.models.UserGroup) {
          return app.models.UserGroup.addUser(app.models.UserGroup.systemGroupLoggedIn(), session.userId)
        }
      })
      .catch((error) => {
        // console.log('login: error')
        // console.log(error)
        if (error instanceof Errors.ServerError) {
          throw error
        } else {
          throw new Errors.ServerGenericError(error)
        }
      })
  }

  const actions = [
    {
      method: 'POST',
      name: `Auth.Password.login`,
      description: `Login via username/password`,
      path: `/auth/login`,
      handler: login,
      /* TODO: validatorFromSchema
      validate: {
        body: app.validator.validatorFromModel(Model)
      }, */
      type: 'Auth',
      object: 'Password'
    }
  ]
}
