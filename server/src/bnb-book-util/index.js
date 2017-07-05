// @flow
import Result from 'folktale/result'

export async function iife(fn : () => any) {
  await fn()
}

export async function _try(fn : () => any) {
  try {
    let r = await fn()
    return Result.Ok(r)
  }
  catch (e) {
    return Result.Error(e.message)
  }
}
