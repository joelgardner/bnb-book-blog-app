import ApolloClient, { createNetworkInterface } from 'apollo-client'
import gql from 'graphql-tag'
import * as Fragments from './fragments'

export const apolloClient = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: 'http://localhost:3000/graphql' })
})

//export const apolloClient

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
  return apolloClient.query({
    query: gql`
      query ListProperties($args: PropertyInput, $search: SearchParameters) {
        listProperties(args: $args, search: $search) {
          ... PropertyAttributes
        }
      }
      ${Fragments.Property.attributes}
    `
  })
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

// const fragments = {
//   property: gql`
//     fragment PropertyListProperty on Property {
//       id
//       street1
//       street2
//       city
//       state
//     }
//   `
// }

// const PropertyListQuery = gql`
//   query ListProperties($args: PropertyInput, $search: SearchParameters) {
//     listProperties(args: $args, search: $search) {
//       ... PropertyListProperty
//     }
//   }
//   ${fragments.property}
// `

const api = {
  listProperties
}
export default api
