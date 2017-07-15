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

export function listProperties(args, searchParameters) {
  return graphql(
    `query ListProperties($args: PropertyInput, $searchParameters: SearchParameters) {
      listProperties(args: $args, searchParameters: $searchParameters) {
        id
        name
        street1
        street2
        city
        state
      }
    }`,
    { args, searchParameters }
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
