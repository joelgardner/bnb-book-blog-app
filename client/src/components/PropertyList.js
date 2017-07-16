import React from 'react'
// import gql from 'graphql-tag'
// import PropTypes from 'prop-types'
// import { graphql } from 'react-apollo'
// import { propType } from 'graphql-anywhere'

const PropertyList = ({ properties = [] }) =>
  <ul>
    {properties.map(property =>
      <li key={property.id}>
        {property.street1} {property.street2} {property.city} {property.state}
      </li>
    )}
  </ul>

export default PropertyList
