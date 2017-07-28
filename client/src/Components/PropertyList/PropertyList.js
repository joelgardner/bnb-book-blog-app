import React from 'react'
import PropertyListItem from '../PropertyListItem/PropertyListItem'

export default class PropertyList extends React.Component {
  render() {
    console.log("rendering")
    const {
      properties,
      onFetchMore,
      onToggleSort
    } = this.props
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

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.properties.length !== nextProps.properties.length
  }
}
