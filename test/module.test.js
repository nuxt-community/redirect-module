jest.setTimeout(60000)

const { Nuxt, Builder } = require('nuxt-edge')
const request = require('request-promise-native')
const getPort = require('get-port')

const redirects = require('./fixture/redirects')
const config = require('./fixture/nuxt.config')
config.dev = false

let nuxt, port

const url = path => `http://localhost:${port}${path}`
const get = path => request(url(path))

const setupNuxt = async (config) => {
  const nuxt = new Nuxt(config)
  await new Builder(nuxt).build()
  port = await getPort()
  await nuxt.listen(port)

  return nuxt
}

const testSuite = () => {
  test('render', async () => {
    const html = await get('/')
    expect(html).toContain('Works!')
  })

  test('simple redirect', async () => {
    const html = await get('/redirected')
    expect(html).toContain('Works!')
  })

  test('simple non-ascii redirect', async () => {
    const html = await get('/äßU<')
    expect(html).toContain('Works!')
  })

  test('many redirect', async () => {
    for (const n of ['abcde', 'abcdeasd', 'raeasdsads']) {
      const html = await get(`/many/${n}`)
      expect(html).toContain('abcde')
    }
  })

  test('mapped redirect', async () => {
    for (const n of ['abcde', 'abcdeasd', 'raeasdsads']) {
      const html = await get(`/mapped/${n}`)
      expect(html).toContain(n)
    }
  })

  test('function evaluated to compute redirect rule to', async () => {
    const html = await get('/function')
    expect(html).toContain('Works!')
  })

  test('async function evaluated to compute redirect rule to', async () => {
    const html = await get('/functionAsync')
    expect(html).toContain('Works!')
  })

  test('async function param considered', async () => {
    const html = await get('/functionAsync/def')
    expect(html).toContain('def')
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
        [require('../'), redirects[0]]
      ]
    })
  })

  afterAll(async () => {
    await nuxt.close()
  })

  testSuite()
})
