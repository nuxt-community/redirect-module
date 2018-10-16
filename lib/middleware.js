/* eslint-disable no-console */

// Creates new middleware using provided options
function create (rules) {
  return async function redirectRoute (req, res, next) {
    const decodedBaseUrl = decodeURI(req.url)
    const foundRule = rules.find(o => o.from.test(decodedBaseUrl))

    if (!foundRule) {
      return next()
    }
    // Expect rule 'to' to be 1)regex or 2)string or
    // 3)function taking from & req (when from is regex, req might be more interesting)
    let toTarget = foundRule.to
    if (typeof toTarget === 'function') {
      toTarget = await toTarget(foundRule.from, req)
    }
    const toUrl = decodedBaseUrl.replace(foundRule.from, toTarget)

    res.statusCode = foundRule.statusCode || 302
    res.setHeader('Location', toUrl)
    res.end()
  }
}

module.exports = create
