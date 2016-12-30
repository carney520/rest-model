export default function (ctx, next) {
  if (ctx.config.HTTPmethodOverride && /^(PUT|PATCH|DELETE)$/i.test(ctx.request.method)) {
    ctx.request.headers.set('X-HTTP-Method-Override', ctx.request.method)
    ctx.request.method = 'POST'
  }
  return next()
}
