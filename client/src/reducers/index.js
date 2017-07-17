import { combineReducers } from 'redux'

//const FETCH_LIMIT = 6

function properties(state = [], action) {
  if (action.entityName !== 'Property') return state
  switch(action.type) {
    case 'FETCH_ENTITIES_SUCCESS':
      return [...state, ...action.entities]
    default:
      return state
  }
}

function selectedProperty(state = null, action) {
  if (action.entityName !== 'Property') return state
  switch(action.type) {
    case 'FETCH_ENTITY_DETAILS_SUCCESS':
      return action.entity
    default:
      return state
  }
}

export default combineReducers({
  properties,
  selectedProperty
})
