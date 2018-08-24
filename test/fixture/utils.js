const { resolve } = require('path')
const redirects = [
  { from: '^/redirected', to: '/' },
  { from: /^\/äßU</, to: '/' },
  { from: '^/many/(.*)$', to: '/posts/abcde' },
  { from: '^/mapped/(.*)$', to: '/posts/$1' }
]

const baseConfig = {
  rootDir: resolve(__dirname, '../..'),
  srcDir: __dirname,
  dev: false,
  render: {
    resourceHints: false
  },
  modules: ['@@']
}

module.exports = { redirects, baseConfig }
