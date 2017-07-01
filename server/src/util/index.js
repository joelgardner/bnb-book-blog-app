// @flow
import R from 'ramda'
import Result from 'folktale/result'

export async function iife(fn : () => any) {
  await fn()
}

export const renameKeys = R.curry((keysMap, obj) =>
  R.reduce((acc, key) => R.assoc(keysMap[key] || key, obj[key], acc), {}, R.keys(obj))
)

export async function _try(fn : () => any) {
  try {
    let r = await fn()
    return Result.Ok(r)
  }
  catch (e) {
    return Result.Error(e.message)
  }
}
