/**
 * return response or error to user
 */
export default function (ctx, next) {
  return next().then(() => {
    const response = ctx.response
    if (response.ok) {
      return response
    } else {
      let error = new Error(response.statusText)
      error.response = response
      throw error
    }
  })
}
