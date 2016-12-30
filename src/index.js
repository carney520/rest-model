/* global Headers, Request, fetch */
import 'whatwg-fetch'
import pathToRegexp from 'path-to-regexp'
import _path from 'path'
import compose from 'babel-loader!koa-compose'

// hooks
import intro from './interceptors/intro.js'
import methodOverride from './interceptors/method.js'
import body from './interceptors/body.js'

// eslint-disable-next-line
const methods = [
  'get',
  'post',
  'put',
  'head',
  'delete',
  'options',
  'patch'
]

/**
 * @example
 *  const Users =  new Rest('/users')
 *     .use(hook)  // middleware like koa
 *     .all('/:id')
 *     .get('/types')
 *     .model()
 *  Users.get({id: 1}) => Promise
 */
export default class Rest {
  constructor (name, prefix = '/') {
    this.name = name
    this.prefix = prefix
    this.rest = true
    this.children = []
    this.hooks = []
    this.actions = []
  }
  use (hook) {
    if (typeof hook !== 'function') throw new TypeError('hook must be a function!')
    this.hooks.push(hook)
    return this
  }
  all (path, options) {}
  register (name, method, path, options) {
    var action = new Action(name, method, path, options)
    this.actions.push(action)
    return this
  }
  nest (nestedRest) {
    if (nestedRest == null || !nestedRest.rest) throw new TypeError('nest must be a Rest instance')
    this.children.push(nestedRest)
    return this
  }
  // 生成可调用的对象
  model (prefix, hooks) {
    let obj = {}
    prefix = prefix ? _path.join(prefix, this.prefix) : this.prefix
    hooks = hooks ? hooks.concat(this.hooks) : this.hooks

    this.actions.forEach(action => {
      obj[action.name] = action.getDispatch(prefix, hooks)
    })

    this.children.forEach(child => {
      obj[child.name] = child.model(prefix, hooks)
    })

    return obj
  }
}

methods.forEach(method => {
  Rest.prototype[method] = function (name, path, options) {
    if (typeof path !== 'string') {
      options = path
      path = name
      name = method
    }
    return this.register(name, method, path, options)
  }
})

Rest.fetch = null
Rest.config = {
  root: '',
  HTTPmethodOverride: false,
  emulateJSON: false
}

function query (ctx, next) {
  const request = new Request(ctx.request.url, {
    ...ctx.request
  })
  console.log(request)
  return fetch(request)
  .then((res) => {
    ctx.response = res
    return next()
  })
  .catch(err => {
    throw err
  })
}

const builtinHooks = [intro, methodOverride, body]
const defaultOptions = {
  mode: 'cors',
  credentials: 'omit',
  cache: 'default',
  redirect: 'follow',
  referrer: 'client'
}

export class Action {
  constructor (name, method, path, options = {}) {
    this.name = name
    this.method = method.toUpperCase()
    this.path = path
    this.options = options
  }
  getDispatch (prefix, hooks) {
    const path = _path.join(prefix, this.path)
    const toPath = pathToRegexp.compile(path)
    console.log(path, hooks)
    hooks = builtinHooks.concat(hooks || [])
    // 负责最后的请求
    hooks.push(query)
    const fn = compose(hooks)
    return (params, body, options = {}) => {
      let ctx = {config: Rest.config}
      let url = toPath(params)
      let headers = new Headers()
      // make request writable
      let request = {
        ...defaultOptions,
        url,
        body,
        headers,
        method: this.method,
        ...options
      }
      ctx.headers = request.headers
      ctx.request = request

      return fn(ctx)
    }
  }
}
