import { combineReducers } from 'redux'
import { List, Map } from 'immutable'

const FETCH_LIMIT = 20

const initialPropertiesState = Map({
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

function properties(state = initialPropertiesState, action) {
  switch(action.type) {
    // case 'APOLLO_QUERY_RESULT':
    //   if (action.operationName === 'ListProperties') {
    //     return state.update('items', items => items.concat(action.result.data.listProperties))
    //   }
    case 'FETCH_ENTITIES':
      return state.withMutations(st => {
        st.update('showing', showing => showing + 1)
          .update('searchParameters', searchParameters => searchParameters.merge(action.searchParameters))
          .update('args', args => args.merge(action.args))
      })
    case 'FETCH_ENTITIES_SUCCESS':
      return state.update('batches', batches => batches.set(action.batchIndex, action.entities))
    default:
      return state
  }
}

export default combineReducers({
  Property: properties
})
