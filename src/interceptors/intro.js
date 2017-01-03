/**
 * return response or error to user
 */
export default function (ctx, next) {
  return next().then(() => {
    const response = ctx.response
    if (!response) return null
    if (response && response.ok) {
      return response
    } else {
      let error = new Error(response.statusText)
      error.response = response
      error.status = response.status
      throw error
    }
  })
}
