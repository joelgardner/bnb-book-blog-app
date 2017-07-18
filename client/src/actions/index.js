
export const fetchEntities = (entityName, apiAction, args = {}, searchParameters = {}) => ({
  type: 'FETCH_ENTITIES',
  entityName,
  apiAction,
  args,
  searchParameters
})

export const fetchEntitiesSuccess = (entityName, entities, batchIndex) => ({
  type: 'FETCH_ENTITIES_SUCCESS',
  entityName,
  entities,
  batchIndex
})

export const fetchEntitiesError = (entityName, error, batchIndex) => ({
  type: 'FETCH_ENTITIES_ERROR',
  entityName,
  error,
  batchIndex
})

export const fetchEntityDetails = (entityName, apiAction, args = {}) => ({
  type: 'FETCH_ENTITY_DETAILS',
  entityName,
  apiAction,
  args
})

export const fetchEntityDetailsSuccess = (entityName, entity, args) => ({
  type: 'FETCH_ENTITY_DETAILS_SUCCESS',
  entityName,
  entity,
  args
})

export const fetchEntityDetailsError = (entityName, error) => ({
  type: 'FETCH_ENTITY_DETAILS_ERROR',
  entityName,
  error
})

export const viewProperty = id => ({
  type: 'VIEW_PROPERTY',
  id
})

export const displayError = msg => ({
  type: 'DISPLAY_ERROR',
  msg
})
