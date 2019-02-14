# Redirect Module 🔀 No more **cumbersome** redirects!
[![npm (scoped with tag)](https://img.shields.io/npm/v/@nuxtjs/redirect-module/latest.svg?style=flat-square)](https://npmjs.com/package/@nuxtjs/redirect-module)
[![npm](https://img.shields.io/npm/dt/@nuxtjs/redirect-module.svg?style=flat-square)](https://npmjs.com/package/@nuxtjs/redirect-module)
[![CircleCI](https://img.shields.io/circleci/project/github/nuxt-community/redirect-module.svg?style=flat-square)](https://circleci.com/gh/nuxt-community/redirect-module)
[![Codecov](https://img.shields.io/codecov/c/github/nuxt-community/redirect-module.svg?style=flat-square)](https://codecov.io/gh/nuxt-community/redirect-module)
[![Dependencies](https://david-dm.org/nuxt-community/redirect-module/status.svg?style=flat-square)](https://david-dm.org/nuxt-community/redirect-module)
[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com)

>

[📖 **Release Notes**](./CHANGELOG.md)

## Features

Redirecting URLs is an often discussed topic, especially when it comes to
SEO. Previously it was hard to create a "real" redirect without performance
loss or incorrect handling. But this time is over!

With the Redirect Module setting up redirects will become easier than ever before!

## Setup
- Add `@nuxtjs/redirect-module` dependency using yarn or npm to your project
- Add `@nuxtjs/redirect-module` to `modules` section of `nuxt.config.js`
- Configure it:

### Inline options
```js
{
  modules: [
    ['@nuxtjs/redirect-module', [ /* Redirect option here */]],
 ]
}
```

### Dedicated option array
```js
{
  modules: [
    '@nuxtjs/redirect-module'
 ],
 redirect: [
  // Redirect options here
 ]
}
```

## Usage

Simply add the links you want to redirect as objects to the module option array:

```js
redirect: [
  { from: '^/myoldurl', to: '/mynewurl' }
 ]
```

You can set up a custom status code as well. By default, it's *302*!

```js
redirect: [
  { from: '^/myoldurl', to: '/mynewurl', statusCode: 301 }
 ]
```

As you may have already noticed, we are leveraging the benefits of
*Regular Expressions*. Hence, you can fully customize your redirects.

```js
redirect: [
  { from: '^/myoldurl/(.*)$', to: '/comeallhere', } // Many urls to one
  { from: '^/anotherold/(.*)$', to: '/new/$1', } // One to one mapping
 ]
```

Furthermoer you can use a function to create your `to` url as well :+1:
The `from` rule and the `req` of the middleware will be provided as arguments.
The function can also be *async*!

```js
redirect: [
  {
    from: '^/someUrlHere/(.*)$',
    to: (from, req) => {
      const param = req.url.match(/functionAsync\/(.*)$/)[1]
      return `/posts/${param}`
    }
  }
]
```

And if you really need more power... okay! You can also use a factory function
to generate your redirects:

```js
redirect: async () => {
  const someThings = await axios.get("/myApi") // It'll wait!
  return someThings.map(coolTransformFunction)
}
```

**ATTENTION**: The factory function **must** return an array with redirect
objects (as seen above).

## Gotcha's
The redirect module only works in universal mode (will not work on generate). Redirects are realized through a server middleware, which can only react when there is a server running which is only the case when your application is in universal/SSR mode.

## Development

- Clone this repository
- Install dependencies using `yarn install` or `npm install`
- Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Alexander Lichter <npm@lichter.io>
