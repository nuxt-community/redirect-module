/* eslint-disable no-console */

// Creates new middleware using provided options
function create(rules) {
  return async function redirectRoute(req, res, next) {
    const decodedBaseUrl = decodeURI(req.url)
    const foundRule = rules.find(o => o.from.test(decodedBaseUrl))

    if (!foundRule) {
      return next()
    }
    // Expect rule 'to' to either a
    // 1) regex
    // 2) string
    // 3) function taking from & req (when from is regex, req might be more interesting)

    const toTarget = typeof foundRule.to === 'function' ? await foundRule.to(foundRule.from, req) : foundRule.to

    const toUrl = decodedBaseUrl.replace(foundRule.from, toTarget)

    res.statusCode = foundRule.statusCode || 302
    res.setHeader('Location', toUrl)
    res.end()
  }
}

module.exports = create
