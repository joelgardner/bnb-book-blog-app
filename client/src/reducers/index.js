import { combineReducers } from 'redux'

const FETCH_LIMIT = 6

function properties(state = [], action) {
  switch(action.type) {
    case 'FETCH_ENTITIES_SUCCESS':
      if (action.entityName !== 'Property') return state

      return state
    default:
      return state
  }
}

// function searchParameters(state = {
//     searchText: null,
//     sortAsc: true,
//     sortKey: 'id',
//     first: FETCH_LIMIT,
//     skip: 0
//   }, action) {
//   switch(action.type) {
//     case 'SEARCH_TEXT_CHANGE':
//       if (action.entityName !== 'Property') return state
//
//       return state
//     default:
//       return state
//   }
// }

export default combineReducers({
  properties//,
  //searchParameters
})
