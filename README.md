# Redirect Module 🔀 No more **cumbersome** redirects!

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Circle CI][circle-ci-src]][circle-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![Dependencies][david-dm-src]][david-dm-href]
[![Standard JS][standard-js-src]][standard-js-href]

> Nuxt module to dynamically redirect initial requests

[📖 **Release Notes**](./CHANGELOG.md)

## Features

Redirecting URLs is an often discussed topic, especially when it comes to
SEO. Previously it was hard to create a "real" redirect without performance
loss or incorrect handling. But this time is over!

## Setup

1. Add the `@nuxtjs/redirect-module` dependency with `yarn` or `npm` to your project
2. Add `@nuxtjs/redirect-module` to the `modules` section of `nuxt.config.js`:
3. Configure it:

```js
{
  modules: [
    ['@nuxtjs/redirect-module', {
      // Redirect option here
      rules: [
        // redirect rules here
      ]
    }]
  ]
}
```

### Using top level options

```js
{
  modules: [
    '@nuxtjs/redirect-module'
  ],
  redirect: {
    // Redirect options here
    rules: [
      // redirect rules here
    ]
  }
}
```

## Options

### `rules`

- Default: `[]`

Rules of your redirects.

### `decodeFullUrl`

- Default: `false`

If enabled, protocol and host will also be considered for redirecting rules so you can have non-www to www or http to https redirects for example. Note that you likely have to adopt your rules when enabling this, e.g. `{ from: '^/myoldurl', to: '/mynewurl' }` will no longer work because the `from` regex no longer matches when proto and host are prepended.

### `onDecode`

Default:

```js
// This will trust proxy headers. You can change this behaviour
// by providing your own onDecode function.
(req, options) => {
  if (options.decodeFullUrl) {
    return decodeURI(req.url)
  } else {
    let proto = req.headers['x-forwarded-proto']
    if (proto === undefined) {
      proto = req.connection.encrypted ? 'https' : 'http'
    }
 
    let host = req.headers['x-forwarded-host']
    if (host === undefined) {
      host = req.httpVersionMajor >= 2 ? req.headers[':authority'] : req.headers.host
    }
 
    return `${proto}://${host}${decodeURI(req.url)}`
  }
}
```

Allows you to change how the url is decoded.

### `onDecodeError`

- Default: `(error, req, res, next) => next(error)`

You can set callback when there is an error in the decode.

### `statusCode`

- Default: `302`

You can set the default statusCode which gets used when no statusCode is defined on the rule itself.

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
  { from: '^/myoldurl/(.*)$', to: '/comeallhere' }, // Many urls to one
  { from: '^/anotherold/(.*)$', to: '/new/$1' } // One to one mapping
]
```

Furthermore you can use a function to create your `to` url as well :+1:
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

For redirecting http to https:

```js
redirect: {
  decodeFullUrl: true,
  rules: [
    {
      from: 'http://example.com/(.*)$',
      to: 'https://example.com/$1',
      statusCode: 301,
    } 
  ]
}
```

Now, if you want to customize your redirects, how your decode is done
or when there is some error in the decode, you can also:

```js
redirect: {
  rules: [
    { from: '^/myoldurl', to: '/mynewurl' }
  ],
  onDecode: (req, res, next) => decodeURI(req.url),
  onDecodeError: (error, req, res, next) => next(error)
}
```

**ATTENTION**: The factory function **must** return an array with redirect
objects (as seen above).

## Gotchas

The redirect module will not work in combination with `nuxt generate`.
Redirects are realized through a server middleware, which can only react when there is a server running.

## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Alexander Lichter <npm@lichter.io>

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/dt/@nuxtjs/redirect-module.svg?style=flat-square
[npm-version-href]: https://npmjs.com/package/@nuxtjs/redirect-module
[npm-downloads-src]: https://img.shields.io/npm/v/@nuxtjs/redirect-module/latest.svg?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@nuxtjs/redirect-module
[circle-ci-src]: https://img.shields.io/circleci/project/github/nuxt-community/redirect-module.svg?style=flat-square
[circle-ci-href]: https://circleci.com/gh/nuxt-community/redirect-module
[codecov-src]: https://img.shields.io/codecov/c/github/nuxt-community/redirect-module.svg?style=flat-square
[codecov-href]: https://codecov.io/gh/nuxt-community/redirect-module
[david-dm-src]: https://david-dm.org/nuxt-community/redirect-module/status.svg?style=flat-square
[david-dm-href]: https://david-dm.org/nuxt-community/redirect-module
[standard-js-src]: https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square
[standard-js-href]: https://standardjs.com
