import { combineReducers } from 'redux'
import { List, Map, fromJS } from 'immutable'
import { FETCH_LIMIT } from '../Constants'

const initialPropertyState = fromJS({
  selectedItem: {},
  showing: -1,
  buffer: {},
  properties: [],
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
    case 'SHOW_MORE':
      // check the buffer to see if we can immediately load a batch of
      // cached properties.  if so, append them to properties and remove
      // them from the buffer
      return state.withMutations(st => {
        const showing = st.get('showing')
        const bufferedProperties = st.getIn(['buffer', showing])
        st.update('showing', s => s + 1)
        if (bufferedProperties) {
          st.update('properties', properties => properties.concat(bufferedProperties))
          st.deleteIn(['buffer', showing])
        }
      })
    case 'FETCH_ENTITIES':
      return state.withMutations(st => {
        st.update('searchParameters', searchParameters => searchParameters.merge(action.searchParameters))
          .update('args', args => args.merge(action.args))
      })
    case 'FETCH_ENTITIES_SUCCESS':
      // if the request's batchIndex (i.e., the value of showing at time of request)
      // is more than the current value for showing, then it goes into the buffer,
      // which is a temporary hold for property batches that shouldn't yet be shown
      // otherwise, we simply append the results to the current properties
      return state.get('showing') <= action.batchIndex ?
        state.update('buffer', buffer => buffer.set(action.batchIndex, List(action.entities))) :
        state.update('properties', properties => properties.concat(action.entities))
    case 'FETCH_ENTITY_DETAILS_SUCCESS':
      return state.set('selectedItem', Map(action.entity))
    default:
      return state
  }
}

export default combineReducers({
  Property: properties
})
