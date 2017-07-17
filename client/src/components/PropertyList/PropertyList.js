import React from 'react'
import PropertyListItem from '../PropertyListItem/PropertyListItem'

const PropertyList = ({ properties = [], onFetchMore }) =>
  <div className="properties-container">
    <div className="columns is-multiline">
      {properties.map(property =>
        <PropertyListItem key={property.id} {...property} />
      )}
    </div>
    <button onClick={() => onFetchMore(properties.length)}>Show More</button>
  </div>

export default PropertyList
