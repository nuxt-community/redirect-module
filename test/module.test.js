
jest.setTimeout(60000)
process.env.PORT = process.env.PORT || 5060

const { Nuxt, Builder } = require('nuxt-edge')
const { JSDOM } = require('jsdom')
const request = require('request-promise-native')

const objectConfig = require('./fixture/simple_object')
const functionConfig = require('./fixture/simple_function')
const functionInlineConfig = require('./fixture/simple_function_inline')

const url = path => `http://localhost:${process.env.PORT}${path}`
const get = path => request(url(path))

const testSuite = () => {
  test('render', async () => {
    const html = await get('/')
    const dom = new JSDOM(html)
    expect(dom.window.document.querySelector('body').textContent).toContain('Works!')
  })

  test('simple redirect', async () => {
    const html = await get('/redirected')
    const dom = new JSDOM(html)
    expect(dom.window.document.querySelector('body').textContent).toContain('Works!')
  })

  test('simple non-ascii redirect', async () => {
    const html = await get('/äßU<')
    const dom = new JSDOM(html)
    expect(dom.window.document.querySelector('body').textContent).toContain('Works!')
  })

  test('many redirect', async () => {
    for (const n of ['abcde', 'abcdeasd', 'raeasdsads']) {
      const html = await get(`/many/${n}`)
      const dom = new JSDOM(html)
      expect(dom.window.document.querySelector('body').textContent).toContain('abcde')
    }
  })

  test('mapped redirect', async () => {
    for (const n of ['abcde', 'abcdeasd', 'raeasdsads']) {
      const html = await get(`/mapped/${n}`)
      const dom = new JSDOM(html)
      expect(dom.window.document.querySelector('body').textContent).toContain(n)
    }
  })

  test('function evaluated to compute redirect rule to', async () => {
    const html = await get('/function')
    const dom = new JSDOM(html)
    expect(dom.window.document.querySelector('body').textContent).toContain('Works!')
  })

  test('async function evaluated to compute redirect rule to', async () => {
    const html = await get('/functionAsync')
    const dom = new JSDOM(html)
    expect(dom.window.document.querySelector('body').textContent).toContain('Works!')
  })

  test('async function param considered', async () => {
    const html = await get('/functionAsync/def')
    const dom = new JSDOM(html)
    expect(dom.window.document.querySelector('body').textContent).toContain('def')
  })
}

describe('basic', () => {
  let nuxt

  beforeAll(async () => {
    nuxt = new Nuxt(objectConfig)
    await new Builder(nuxt).build()
    await nuxt.listen(process.env.PORT)
  })

  afterAll(async () => {
    await nuxt.close()
  })

  testSuite()
})

describe('function', () => {
  let nuxt

  beforeAll(async () => {
    nuxt = new Nuxt(functionConfig)
    await new Builder(nuxt).build()
    await nuxt.listen(process.env.PORT)
  })

  afterAll(async () => {
    await nuxt.close()
  })

  testSuite()
})

describe('function inline', () => {
  let nuxt

  beforeAll(async () => {
    nuxt = new Nuxt(functionInlineConfig)
    await new Builder(nuxt).build()
    await nuxt.listen(process.env.PORT)
  })

  afterAll(async () => {
    await nuxt.close()
  })

  testSuite()
})
