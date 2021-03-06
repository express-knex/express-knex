import jwt from 'jsonwebtoken'
import Session from '@express-knex/entity-session'

const packageName = 'Session-jwt'
const DEF_SECRET = 'jhwckjeqfjnqwdoijed'

export default module.exports = (app) => {
  // guard empty app object
  if (!app.meta) {
    app.meta = {}
  }
  if (!app.meta.modules) {
    app.meta.modules = []
  }
  if (!app.meta.actions) {
    app.meta.actions = []
  }

  // define deps:
  app.meta.modules.push({
    module: packageName,
    dependency: 'models.Session'
  })
  app.meta.modules.push({
    module: packageName,
    dependency: 'models.User'
  })

  app.meta.modules.push({
    module: packageName,
    dependency: ['errors', 'errors.ServerNotAllowed']
  })

  // install Session object if needed:
  if (!app.models.Session) {
    app.models.Session = Session(app)
  }
  // define methods on app.auth path:
  // encode sessionID into JWT:
  const encode = (sessionId) =>
    jwt.sign({ id: sessionId }, app.env.JWT_SECRET ? app.env.JWT_SECRET : DEF_SECRET, { expiresIn: '1h' })

  // parse req header and extract schema/token
  const getTokenFromReq = (req) => {
    const pattern = /(\S+)\s+(\S+)/
    const headerValue = req.get('authorization')
    if (typeof headerValue !== 'string') {
      return null
    }
    const parsedHeaderValue = headerValue.match(pattern)
    return parsedHeaderValue && { scheme: parsedHeaderValue[1].toLowerCase(), token: parsedHeaderValue[2] }
  }

  // middleware to check session in JWT, lod if from storage and load user profile:
  const check = (req, res, next) => {
    const Session = req.app.models.Session
    const User = req.app.models.User
    const Errors = req.app.errors

    const auth = app.auth.getTokenFromReq(req)
    if (auth && auth.scheme === 'bearer') {
      // we have some token
      try {
        const payload = jwt.verify(auth.token, app.env.JWT_SECRET ? app.env.JWT_SECRET : DEF_SECRET, { clockTolerance: 3 })
        let aSession = {}
        Session.findById(payload.id)
          .then((session) => {
            if (!session) {
              return next(new Errors.ServerNotAllowed('session not registered'), null)
            }
            if (!session.createdAt || !session.userId) {
              return next(new Errors.ServerNotAllowed('session structure is invalid'), null)
            }
            aSession = session
            return User.findById(session.userId)
          })
          .then((user) => {
            if (!user) {
              return next(new Errors.ServerNotAllowed('User not found'), null)
            }
            req.user = user
            req.user.session = aSession
            req.user.jwt = payload
            next()
          })
          .catch(e => next(e))
      } catch (e) {
        next(e)
      }
    } else {
      next(new Error('Auth failed, no auth header or unknown scheme'))
    }
  }

  return {
    encode,
    getTokenFromReq,
    check
  }
}
