module.exports = [
  { from: '/redirected', to: '/' },
  { from: '/äßU<', to: '/' },
  { path: '/many/(.*)', to: '/posts/abcde' },
  { from: '/mapped/:id', redirect: '/posts/:id' }
]
