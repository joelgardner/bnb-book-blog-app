import { combineReducers } from 'redux'

//const FETCH_LIMIT = 6

function properties(state = [], action) {
  switch(action.type) {
    case 'FETCH_ENTITIES_SUCCESS':
      if (action.entityName !== 'Property') return state
      return [...state, ...action.entities]
    default:
      return state
  }
}

export default combineReducers({
  properties
})
