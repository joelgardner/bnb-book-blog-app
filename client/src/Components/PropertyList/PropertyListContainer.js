import PropertyList from './PropertyList'
import { connect } from 'react-redux'
import { viewProperty, fetchEntities } from '../../Actions'

const PropertyListContainer = connect(
  state => ({
    immutable: state.app.Property
  }),
  dispatch => ({
    onFetchMore() {
      dispatch(fetchEntities('Property', 'listProperties'))
    },
    onChangeSort(sortAsc) {
      //dispatch(apiCall('listProperties', {}, { sortAsc }))
    }
  })
)(PropertyList)

export default PropertyListContainer
