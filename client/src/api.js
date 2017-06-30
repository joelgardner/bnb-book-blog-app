export function createUser(email) {
  return graphql(
    `mutation CreateUser($email: String!) {
      createUser(email: $email) {
        id
        email
      }
    }`,
    { email }
  )
}

function graphql(query, args) {
  return send(`/graphql`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ query, args })
  })
}

async function send(url, options) {
  const res = await fetch(url, options)
  if (!res.ok) {
    const err = new Error(await res.json())
    return Promise.reject(err)
  }
  return res.json()
}
