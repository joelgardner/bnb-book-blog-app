import { combineReducers } from 'redux'
import { List, Map } from 'immutable'
import { FETCH_LIMIT } from '../Constants'

const initialPropertyState = Map({
  selectedItem: null,
  showing: -1,
  batches: List(),
  args: Map(),
  searchParameters: Map({
    sortKey: 'id',
    sortAsc: true,
    searchText: '',
    first: FETCH_LIMIT,
    skip: 0
  })
})

function properties(state = initialPropertyState, action) {
  switch(action.type) {
    case 'FETCH_ENTITIES':
      return state.withMutations(st => {
        st.update('showing', showing => showing + 1)
          .update('searchParameters', searchParameters => searchParameters.merge(action.searchParameters))
          .update('args', args => args.merge(action.args))
          .update('batches', batches => batches.push([]))
      })
    case 'FETCH_ENTITIES_SUCCESS':
      return state.update('batches', batches => batches.set(action.batchIndex, action.entities))
    case 'FETCH_ENTITY_DETAILS_SUCCESS':
      return state.set('selectedItem', action.entity)
    default:
      return state
  }
}

export default combineReducers({
  Property: properties
})
