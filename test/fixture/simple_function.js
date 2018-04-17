const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname, '../..'),
  srcDir: __dirname,
  dev: false,
  render: {
    resourceHints: false
  },
  modules: ['@@'],
  redirect: async () => {
    await Promise.resolve(r => setTimeout(r, 100))
    return [
      { from: '^/redirected', to: '/' },
      { from: '^/many/(.*)$', to: '/posts/abcde' },
      { from: '^/mapped/(.*)$', to: '/posts/$1' }
    ]
  }
}
