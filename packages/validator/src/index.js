export default (app) => {
  const Validator = {
    validate: (Model) => (req, res, next) => {
      next()
    },
    check: (model, part)
  }
  return Validator
}
