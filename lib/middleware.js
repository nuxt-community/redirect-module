/* eslint-disable no-console */

// Creates new middleware using provided options
function create (rules) {
  return function redirectRoute (req, res, next) {
    const decodedBaseUrl = decodeURI(req.url)
    const foundRule = rules.find(o => o.from.test(decodedBaseUrl))

    if (!foundRule) {
      return next()
    }
    // Expect rule 'to' to be 1)regex or 2)string or 3)synchronous function taking from to compute to
    let toTarget = foundRule.to
    if (typeof toTarget === 'function') {
      toTarget = toTarget(foundRule.from)
    }
    const toUrl = decodedBaseUrl.replace(foundRule.from, toTarget)

    res.statusCode = foundRule.statusCode || 302
    res.setHeader('Location', toUrl)
    res.end()
  }
}

module.exports = create
