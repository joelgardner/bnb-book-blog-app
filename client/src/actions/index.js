
export const fetchEntities = (entityName, args, searchParameters) => ({
  type: 'FETCH_ENTITIES',
  entityName,
  args,
  searchParameters
})

export const fetchEntitiesSuccess = (entityName, entities) => ({
  type: 'FETCH_ENTITIES_SUCCESS',
  entityName,
  entities
})

export const fetchEntitiesError = (entityName, error) => ({
  type: 'FETCH_ENTITIES_ERROR',
  entityName,
  error
})

export const viewProperty = (id) => ({
  type: 'VIEW_PROPERTY',
  id
})
