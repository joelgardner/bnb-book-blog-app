import PropertyList from './PropertyList'
import { connect } from 'react-redux'
import { fetchEntities } from '../../Actions'
import React from 'react'

/*
  mapImmutableJsPropsToProps is a Higher-Order-Component which extracts props
  from the ImmutableJS object passed in from the Redux container below.
*/
const mapImmutableJsPropsToProps = WrappedComponent => ({ immutable, ...uiEvents }) =>
  <WrappedComponent {...{
    properties: batchesToProperties(
      immutable.get('batches'),
      immutable.get('showing')
    ),
    ...uiEvents
  }} />

function batchesToProperties(batches, showing) {
  return batches
    .take(showing)
    .filter(b => b)
    .flatten(true)
    .toJS()
}

/*
  Redux Container is given the ImmutableJS structure and does not render its
  child component (which is our mapImmutableJsPropsToProps HOC above) unless
  it has changed.
*/
const mapStateToProps = state => ({
  immutable: state.app.Property
})

const mapDispatchToProps = dispatch => ({
  onFetchMore() {
    dispatch(fetchEntities('Property', 'listProperties'))
  },
  onChangeSort(sortAsc) {
    //dispatch(apiCall('listProperties', {}, { sortAsc }))
  }
})

const PropertyListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(mapImmutableJsPropsToProps(PropertyList))

export default PropertyListContainer
