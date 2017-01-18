/* global Blob FormData */
export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

export function isPlainObject (obj) {
  return isObject(obj) && Object.getPrototypeOf(obj) === Object.prototype
}

export function isBlob (obj) {
  return typeof Blob !== 'undefined' && obj instanceof Blob
}

export function isFormData (obj) {
  return typeof FormData !== 'undefined' && obj instanceof FormData
}

export const isArray = Array.isArray

function normalizeArray (parts, allowAboveRoot) {
  var res = []
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i]

    // ignore empty parts
    if (!p || p === '.') continue
    if (p === '..') {
      if (res.length && res[res.length - 1] !== '..') {
        res.pop()
      } else if (allowAboveRoot) {
        res.push('..')
      }
    } else {
      res.push(p)
    }
  }

  return res
}

function normalize (path) {
  let isAbsolute = path.charAt(0) === '/'
  let trailingSlash = path && path[path.length - 1] === '/'

  // Normalize the path
  path = normalizeArray(path.split('/'), !isAbsolute).join('/')

  if (!path && !isAbsolute) {
    path = '.'
  }
  if (path && trailingSlash) {
    path += '/'
  }

  return (isAbsolute ? '/' : '') + path
}

export function join () {
  var path = ''
  for (var i = 0; i < arguments.length; i++) {
    var segment = arguments[i]
    if (typeof segment !== 'string') {
      throw new TypeError('Arguments to path.join must be strings')
    }
    if (segment) {
      if (!path) {
        path += segment
      } else {
        path += '/' + segment
      }
    }
  }
  return normalize(path)
}
