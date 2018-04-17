const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname, '../..'),
  srcDir: __dirname,
  dev: false,
  render: {
    resourceHints: false
  },
  modules: [
    ['@@', () => [
      { from: '^/redirected', to: '/' },
      { from: '^/many/(.*)$', to: '/posts/abcde' },
      { from: '^/mapped/(.*)$', to: '/posts/$1' }
    ]]
  ]
}
