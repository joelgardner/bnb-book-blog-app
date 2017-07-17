import ApolloClient, { createNetworkInterface } from 'apollo-client'
import gql from 'graphql-tag'
import * as Fragments from './Fragments'

/**
  The API wraps an Apollo client, which provides query/mutation execution
  as well as fragment caching.
*/
export const apolloClient = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: 'http://localhost:3000/graphql' })
})

/**
  @param {Object} args - Map of Property attribute names to values.
  @param {Object} search - Map of search parameters.
  @returns {Promise<List<Property>>} Uses Apollo to fulfill listProperties query.
*/
export const listProperties = (args, search) => apolloClient.query({
  query: gql`
    query ListProperties($args: PropertyInput, $search: SearchParameters) {
      listProperties(args: $args, search: $search) {
        ... PropertyAttributes
      }
    }
    ${Fragments.Property.attributes}
  `,
  variables: {
    args,
    search
  }
})
