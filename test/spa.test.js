jest.setTimeout(60000)

const { Nuxt, Builder } = require('nuxt-edge')
const getPort = require('get-port')
const consola = require('consola')

const redirects = require('./fixture/spa/redirects')
const config = require('./fixture/spa/nuxt.config')
config.dev = false

let nuxt, port

consola.mockTypes(() => jest.fn())

const url = path => `http://localhost:${port}${path}`

const renderRoute = async (path) => {
  const window = await nuxt.renderAndGetWindow(url(path))
  const head = window.document.head.innerHTML
  const html = window.document.body.innerHTML
  return { window, head, html }
}

const setupNuxt = async (config) => {
  const nuxt = new Nuxt(config)
  await nuxt.ready()
  await new Builder(nuxt).build()
  port = await getPort()
  await nuxt.listen(port)

  return nuxt
}

const testSuite = () => {
  test('render', async () => {
    const { html } = await renderRoute('/')
    expect(html).toContain('Works!')
  })

  test('simple redirect', async () => {
    const { html } = await renderRoute('/redirected')
    expect(html).toContain('Works!')
  })

  test('simple non-ascii redirect', async () => {
    const { html } = await renderRoute('/äßU<')
    expect(html).toContain('Works!')
  })

  test('many redirect', async () => {
    for (const n of ['abcde', 'abcdeasd', 'raeasdsads']) {
      const { html } = await renderRoute(`/many/${n}`)
      expect(html).toContain('abcde')
    }
  })

  test('mapped redirect', async () => {
    for (const n of ['abcde', 'abcdeasd', 'raeasdsads']) {
      const { html } = await renderRoute(`/mapped/${n}`)
      expect(html).toContain(n)
    }
  })
}

describe('module', () => {
  beforeAll(async () => {
    nuxt = await setupNuxt(config)
  })

  afterAll(async () => {
    await nuxt.close()
  })

  testSuite()
})

describe('function', () => {
  beforeAll(async () => {
    nuxt = await setupNuxt({
      ...config,
      redirect: async () => {
        await Promise.resolve(r => setTimeout(r, 100))
        return redirects
      }
    })
  })

  afterAll(async () => {
    await nuxt.close()
  })

  testSuite()
})

describe('function inline', () => {
  beforeAll(async () => {
    nuxt = await setupNuxt({
      ...config,
      modules: [
        [require('../'), redirects]
      ]
    })
  })

  afterAll(async () => {
    await nuxt.close()
  })

  testSuite()
})
