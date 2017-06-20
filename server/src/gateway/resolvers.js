import R from 'ramda'

const users = [
  { id: 0, email: 'toby@dundermifflin.com' },
  { id: 1, email: 'jim@dundermifflin.com' },
  { id: 2, email: 'pam@dundermifflin.com' },
  { id: 3, email: 'dwight@dundermifflin.com' },
  { id: 4, email: 'michael@dundermifflin.com' },
  { id: 5, email: 'andy@dundermifflin.com' },
]

export function getUser({ id }, context) {
  return users[id]
}

export function createUser({ email }, context) {
  users.push({ id: users.length, email })
  return R.last(users)
}
