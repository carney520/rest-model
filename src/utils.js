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
