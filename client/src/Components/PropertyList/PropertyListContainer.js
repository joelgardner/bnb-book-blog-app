import PropertyList from './PropertyList'
import { connect } from 'react-redux'
import { viewProperty, fetchEntities } from '../../Actions'
import R from 'ramda'

const PropertyListContainer = connect(
  state => {
    let st = state.app.Property.toJS()
    return {
      properties: R.flatten(st.batches.slice(0, st.showing)),
      args: st.args,
      searchParameters: st.searchParameters
    }
  },
  dispatch => ({
    onSelectProperty(id) {
      dispatch(viewProperty(id))
    },
    onFetchMore() {
      dispatch(fetchEntities('Property', 'listProperties'))
    },
    onChangeSort(sortAsc) {
      //dispatch(apiCall('listProperties', {}, { sortAsc }))
    }
  })
)(PropertyList)

export default PropertyListContainer
