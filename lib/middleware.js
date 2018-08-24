/* eslint-disable no-console */

// Creates new middleware using provided options
function create (rules) {
  return function redirectRoute (req, res, next) {
    const decodedBaseUrl = decodeURI(req.url)
    const foundRule = rules.find(o => o.from.test(decodedBaseUrl))

    if (!foundRule) {
      return next()
    }
    const toUrl = decodedBaseUrl.replace(foundRule.from, foundRule.to)

    res.statusCode = foundRule.statusCode || 302
    res.setHeader('Location', toUrl)
    res.end()
  }
}

module.exports = create
