import { combineReducers } from 'redux'
import { List, Map, fromJS } from 'immutable'
import { FETCH_LIMIT } from '../Constants'

const initialPropertyState = fromJS({
  selectedItem: null,
  showing: -1,
  batches: [],
  args: {},
  searchParameters: {
    sortKey: 'id',
    sortAsc: true,
    searchText: '',
    first: FETCH_LIMIT,
    skip: 0
  }
})

function properties(state = initialPropertyState, action) {
  switch(action.type) {
    case 'FETCH_ENTITIES':
      return state.withMutations(st => {
        st.update('showing', showing => showing + 1)
          .update('searchParameters', searchParameters => searchParameters.merge(action.searchParameters))
          .update('args', args => args.merge(action.args))
      })
    case 'FETCH_ENTITIES_SUCCESS':
      return state.update('batches', batches => batches.set(action.batchIndex, List(action.entities)))
    case 'FETCH_ENTITY_DETAILS_SUCCESS':
      return state.set('selectedItem', Map(action.entity))
    default:
      return state
  }
}

export default combineReducers({
  Property: properties
})
