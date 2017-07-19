import React from 'react'
import PropertyListItem from '../PropertyListItem/PropertyListItem'

const PropertyList = ({ immutable, onFetchMore, onToggleSort }) => {
  const properties = batchesToProperties(
    immutable.get('batches'),
    immutable.get('showing')
  )
  return (
    <div className="properties-container">
      <div className="columns is-multiline">
        {properties.map(property =>
          <PropertyListItem key={property.id} {...property} />
        )}
      </div>
      <button onClick={() => onFetchMore()}>Show More</button>
      <button onClick={() => onToggleSort()}>Toggle Sort</button>
    </div>
  )
}

function batchesToProperties(batches, showing) {
  return batches
    .take(showing)
    .filter(b => b)
    .flatten(true)
    .toJS()
}

export default PropertyList
