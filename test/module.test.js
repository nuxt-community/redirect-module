const { Nuxt, Builder } = require('nuxt')
const request = require('request-promise-native')

const objectConfig = require('./fixture/simple_object.js')
const functionConfig = require('./fixture/simple_function.js')
const functionInlineConfig = require('./fixture/simple_function_inline.js')

const url = path => `http://localhost:3000${path}`
const get = path => request(url(path))

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

  test('render', async () => {
    let html = await get('/')
    expect(html).toContain('Works!')
  })

  test('simple redirect', async () => {
    let html = await get('/redirected')
    expect(html).toContain('Works!')
  })
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

  test('render', async () => {
    let html = await get('/')
    expect(html).toContain('Works!')
  })

  test('simple redirect', async () => {
    let html = await get('/redirected')
    expect(html).toContain('Works!')
  })
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

  test('render', async () => {
    let html = await get('/')
    expect(html).toContain('Works!')
  })

  test('simple redirect', async () => {
    let html = await get('/redirected')
    expect(html).toContain('Works!')
  })
})
