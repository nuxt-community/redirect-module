const { Nuxt, Builder } = require('nuxt')
const request = require('request-promise-native')

const objectConfig = require('./fixture/simple_object.js')
const functionConfig = require('./fixture/simple_function.js')
const functionInlineConfig = require('./fixture/simple_function_inline.js')

const { JSDOM } = require('jsdom')

const url = path => `http://localhost:3000${path}`
const get = path => request(url(path))

const testSuite = () => {
  test('render', async () => {
    try {
      let html = await get('/')
      let dom = new JSDOM(html)
      expect(dom.window.document.querySelector('body').textContent).toContain('Works!')
    } catch (e) {
      expect(e).toBeNull()
    }
  })

  test('simple redirect', async () => {
    try {
      let html = await get('/redirected')
      let dom = new JSDOM(html)
      expect(dom.window.document.querySelector('body').textContent).toContain('Works!')
    } catch (e) {
      expect(e).toBeNull()
    }
  })

  test('many redirect', async () => {
    for (const n of ['abcde', 'abcdeasd', 'raeasdsads']) {
      try {
        let html = await get(`/many/${n}`)
        let dom = new JSDOM(html)
        expect(dom.window.document.querySelector('body').textContent).toContain('abcde')
      } catch (e) {
        expect(e).toBeNull()
      }
    }
  })

  test('mapped redirect', async () => {
    for (const n of ['abcde', 'abcdeasd', 'raeasdsads']) {
      try {
        let html = await get(`/mapped/${n}`)
        let dom = new JSDOM(html)
        expect(dom.window.document.querySelector('body').textContent).toContain(n)
      } catch (e) {
        expect(e).toBeNull()
      }
    }
  })
}

describe('basic', () => {
  let nuxt

  beforeAll(async () => {
    nuxt = new Nuxt(objectConfig)
    await new Builder(nuxt).build()
    await nuxt.listen(3000)
  }, 60000)

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
    await nuxt.listen(3000)
  }, 60000)

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
    await nuxt.listen(3000)
  }, 60000)

  afterAll(async () => {
    await nuxt.close()
  })

  testSuite()
})
