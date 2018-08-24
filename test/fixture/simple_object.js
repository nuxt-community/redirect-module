const { redirects, baseConfig } = require('./utils')

module.exports = Object.assign({}, baseConfig, { redirect: redirects })
