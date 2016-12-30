import {isFormData, isBlob, isObject, isArray} from '../utils.js'
import queryString from 'query-string'
export default function (ctx, next) {
  let body = ctx.request.body

  if (isFormData(body) || isBlob(body)) {
    return next()
  } else if (isObject(body) || isArray(body)) {
    if (/^(GET|HEAD)$/i.test(ctx.request.method)) {
      ctx.request.url += (ctx.request.url.indexOf('?') === -1 ? '?' : '&') + queryString.stringify(body)
      ctx.request.body = undefined
    } else if (ctx.config.emulateJSON) {
      ctx.request.body = queryString.stringify(body)
      ctx.request.headers.set('Content-Type', 'application/x-www-form-urlencoded')
    } else {
      ctx.request.body = JSON.stringify(body)
      ctx.request.headers.set('Content-Type', 'application/json')
    }
  }
  return next()
}
