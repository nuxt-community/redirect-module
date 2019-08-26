// Creates new middleware using provided options
module.exports = function (options) {
  return async function redirectRoute (req, res, next) {
    let decodedBaseUrl

    try {
      decodedBaseUrl = options.onDecode(req, res, next)
    } catch (error) {
      return options.onDecodeError(error, req, res, next)
    }

    const foundRule = options.rules.find(o => o.from.test(decodedBaseUrl))

    if (!foundRule) {
      return next()
    }

    // Expect rule 'to' to either a
    // 1) regex
    // 2) string
    // 3) function taking from & req (when from is regex, req might be more interesting)

    let toTarget

    try {
      toTarget = typeof foundRule.to === 'function' ? await foundRule.to(foundRule.from, req) : foundRule.to
    } catch (error) {
      return next(error)
    }

    const toUrl = decodedBaseUrl.replace(foundRule.from, toTarget)

    try {
      res.setHeader('Location', toUrl)
    } catch (error) {
      // Not passing the error as it's caused by URL that was user-provided so we
      // can't do anything about the error.
      return next()
    }

    res.statusCode = foundRule.statusCode || options.statusCode
    res.end()
  }
}
