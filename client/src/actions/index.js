
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

export const fetchEntityDetails = (entityName, args, searchParameters) => ({
  type: 'FETCH_ENTITY_DETAILS',
  entityName,
  args,
  searchParameters
})

export const fetchEntityDetailsSuccess = (entityName, entity, args, searchParameters) => ({
  type: 'FETCH_ENTITY_DETAILS_SUCCESS',
  entityName,
  entity,
  args,
  searchParameters
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
