const packageName = 'Auth-password package'

export default module.exports = (app) => {
  // define dependencies:
  app.meta.modules.push({
    module: packageName,
    dependency: 'models.User'
  })

  app.meta.modules.push({
    module: packageName,
    dependency: 'models.Session'
  })

  app.meta.modules.push({
    module: packageName,
    dependency: [
      'errors', 'errors.ServerInvalidUsernamePassword',
      'app.errors.ServerNotAllowed', 'app.errors.ServerGenericError'
    ]
  })

  app.meta.modules.push({
    module: packageName,
    dependency: 'auth.getTokenFromSession'
  })

  const login = (req, res) => {
    const User = req.app.models.User
    const Errors = req.app.errors
    const Session = req.app.models.Session
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
        res.json({ token: req.app.auth.getTokenFromSession(session.id) })

        if (req.app.models.UserGroup) {
          return req.app.models.UserGroup.addUser(req.app.models.UserGroup.systemGroupLoggedIn(), session.userId)
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
      name: `Auth.Password.Login`,
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

  if (!app.meta) {
    app.meta = {}
  }
  app.meta.actions = app.actions.concat(actions)
  return app
}
