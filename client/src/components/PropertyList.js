import React from 'react'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { propType } from 'graphql-anywhere'

export default function PropertyList({ data: { loading, error, listProperties } }) {
  if (loading) return null
  console.log(loading, error, listProperties)

  // static propTypes = {
  //   properties: PropTypes.arrayOf(propType(PropertyList.fragments.property)).isRequired
  // }

  //render() {
    return (
      <ul>
        {listProperties.map(property =>
          <li key={property.id}>
            {property.street1} {property.street2} {property.city} {property.state}
          </li>
        )}
      </ul>
    )
  //}
}


//
// const PropertyListWithData = graphql(PropertyListQuery, {
//   options: {
//     variables: {
//       args: {},
//       search: {}
//     }
//   }
// })(PropertyList)

//export PropertyListWithData
