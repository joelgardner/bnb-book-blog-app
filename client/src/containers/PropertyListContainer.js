import React from 'react'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { propType } from 'graphql-anywhere'
import PropertyList from '../components/PropertyList'
import { connect } from 'react-redux'
import { viewProperty } from '../actions'

const fragments = {
  property: gql`
    fragment PropertyListProperty on Property {
      id
      street1
      street2
      city
      state
    }
  `
}

const PropertyListQuery = gql`
  query ListProperties($args: PropertyInput, $search: SearchParameters) {
    listProperties(args: $args, search: $search) {
      ... PropertyListProperty
    }
  }
  ${fragments.property}
`

const PropertyListWithData = graphql(PropertyListQuery, {
  options: {
    variables: {
      args: {},
      search: {}
    }
  }
})(PropertyList)
export default PropertyListWithData

const PropertyListWithDataAndState = connect(
  state => ({
    properties: state.listProperties
  }),
  dispatch => ({
    onSelectProperty(id) {
      dispatch(viewProperty(id))
    }
  })
)(PropertyListWithData)

//export default PropertyListWithDataAndState
