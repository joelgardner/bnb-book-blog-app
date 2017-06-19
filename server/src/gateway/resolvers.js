const users = [
  { id: 1, email: 'jim@dundermifflin.com' },
  { id: 2, email: 'pam@dundermifflin.com' },
  { id: 3, email: 'dwight@dundermifflin.com' },
  { id: 4, email: 'michael@dundermifflin.com' },
  { id: 5, email: 'andy@dundermifflin.com' },
]

export function getUser({ id }, _, context) {
  return Promise.resolve(users[id])
}

export const Mutation = {

}
