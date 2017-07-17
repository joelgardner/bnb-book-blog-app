import PropertyList from './PropertyList'
import { connect } from 'react-redux'
import { viewProperty, fetchEntities } from '../../Actions'

const PropertyContainer = connect(
  state => ({
    properties: state.app.properties
  }),
  dispatch => ({
    onSelectProperty(id) {
      dispatch(viewProperty(id))
    },
    onFetchMore(skip) {
      dispatch(fetchEntities('Property', {}, { skip }))
    }
  })
)(PropertyList)

export default PropertyContainer
