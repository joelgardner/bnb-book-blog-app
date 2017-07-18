import React from 'react'
import PropertyListItem from '../PropertyListItem/PropertyListItem'

const PropertyList = ({ properties = [], searchParameters = {}, onFetchMore, onToggleSort }) => console.log("ASDF", properties) ||
  <div className="properties-container">
    <div className="columns is-multiline">
      {properties.map(property =>
        <PropertyListItem key={property.id} {...property} />
      )}
    </div>
    <button onClick={() => onFetchMore()}>Show More</button>
    <button onClick={() => onToggleSort()}>Toggle Sort</button>
  </div>

export default PropertyList
