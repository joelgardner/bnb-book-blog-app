import PropertyList from '../components/PropertyList'
import { connect } from 'react-redux'
import { viewProperty } from '../actions'

const PropertyContainer = connect(
  state => ({
    properties: state.properties
  }),
  dispatch => ({
    onSelectProperty(id) {
      dispatch(viewProperty(id))
    }
  })
)(PropertyList)

export default PropertyContainer
