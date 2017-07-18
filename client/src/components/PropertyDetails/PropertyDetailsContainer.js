import PropertyDetails from './PropertyDetails'
import { connect } from 'react-redux'
// import { viewProperty, fetchEntities } from '../../Actions'

const PropertyDetailsContainer = connect(
  state => ({
    property: state.app.Property.get('selectedItem')
  }),
  dispatch => ({
    // onSelectProperty(id) {
    //   dispatch(viewProperty(id))
    // },
    // onFetchMore(skip) {
    //   dispatch(fetchEntities('Property', {}, { skip }))
    // }
  })
)(PropertyDetails)

export default PropertyDetailsContainer
