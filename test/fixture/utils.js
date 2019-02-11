const { resolve } = require('path')
const redirects = [
  { from: '^/redirected', to: '/' },
  { from: /^\/äßU</, to: '/' },
  { from: '^/many/(.*)$', to: '/posts/abcde' },
  { from: '^/mapped/(.*)$', to: '/posts/$1' },
  { from: '^/function$', to: () => '/' },
  {
    from: '^/functionAsync$',
    to: () => new Promise((resolve) => {
      setTimeout(() => resolve('/'), 2000)
    })
  },
  {
    from: '^/functionAsync/(.*)$',
    to: (from, req) => new Promise((resolve) => {
      const param = req.url.match(/functionAsync\/(.*)$/)[1]
      setTimeout(() => resolve(`/posts/${param}`), 2000)
    })
  }
]

const baseConfig = {
  rootDir: resolve(__dirname, '../..'),
  srcDir: __dirname,
  dev: false,
  render: {
    resourceHints: false
  }
}

module.exports = { redirects, baseConfig }
