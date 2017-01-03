#REST-model
An elegant REST client for Javascript

## Install
```
npm i rest-model
```

## Usage

```
// import fetch polyfill
import "whatwg-fetch"
import Rest from 'rest-model' 

const api = new Rest('api', '/api/vi')
api.use(async (ctx, next) => {
    console.log('before foo')
    ctx.headers.set('X-Token', 'adad23ezcab8162easd')
    await next()
    console.log('after foo')
})

const Users = new Rest('User', '/users')
User
  .use(async (ctx, next) => {
    console.log('before bar')
    await next()
    console.log('after bar')
  })
  .post('create', '/')
  .get('all', '/')
  .get('types', '/types')
  .get('/:id')

const $ = api.nest(Users)
  .model()

$.Users.get({id: 1})  // => GET /api/v1/users/1
$.Users.all()         // => GET /api/v1/users/
$.Users.types()       // => GET /api/v1/users/types
$.Users.create(null, {name: 'foo', age: 12}) // => POST /api/v1/users/

// hooks
$.Users.all()        // => before foo
                     // => before bar
                     // => after bar
                     // => after foo
```

## API