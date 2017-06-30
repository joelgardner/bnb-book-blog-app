import { select, insert } from '../storage'

export async function getUser({ id }, context) {
  try {
    const results = await select('User', { _id: id })
    return Object.assign(results[0], { id : results[0]._id })
  }
  catch (e) {
    console.log(e)
    throw e
  }
}

export async function createUser(user, context) {
  try {
    return await insert('User', user)
  }
  catch (e) {
    console.log(e)
    throw e
  }
}
