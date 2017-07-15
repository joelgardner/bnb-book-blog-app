
export const fetchEntities = (entityName, args, searchParameters) => ({
  type: 'FETCH_ENTITIES',
  entityName,
  args,
  searchParameters
})

export const viewProperty = (id) => ({
  type: 'VIEW_PROPERTY',
  id
})
