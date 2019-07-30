// Creates new middleware using provided options
module.exports = function (options) {
  return async function redirectRoute(req, res, next) {
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

    const toTarget = typeof foundRule.to === 'function' ? await foundRule.to(foundRule.from, req) : foundRule.to
    const toUrl = decodedBaseUrl.replace(foundRule.from, toTarget)

    res.statusCode = foundRule.statusCode || options.statusCode
    res.setHeader('Location', toUrl)
    res.end()
  }
}
