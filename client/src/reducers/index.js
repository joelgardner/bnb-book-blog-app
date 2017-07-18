import { combineReducers } from 'redux'
import { List, Map } from 'immutable'

const FETCH_LIMIT = 20

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

const initialState = Map({
  properties: Map({
    items: List(),
    args: Map(),
    searchParameters: Map({
      sortKey: 'id',
      sortAsc: true,
      searchText: '',
      first: FETCH_LIMIT,
      skip: 0
    })
  }),
})
function entities(state = initialState, action) {
  switch(action.type) {
    case 'APOLLO_QUERY_RESULT':
      if (action.operationName === 'ListProperties') {
        return state.updateIn(
          ['properties', 'items'],
          items => items.concat(action.result.data.listProperties)
        )
      }
    default:
      return state
  }
}

export default combineReducers({
  properties,
  selectedProperty,
  entities
})
