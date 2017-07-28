import React from 'react'
import { Link } from 'redux-little-router'

const PropertyListItem = ({ id, street1, street2, city, state }) =>
  <div className="column is-one-third">
    <Link href={`/property/${id}`}>{id} {street1} {street2} {city} {state}</Link>
  </div>

export default PropertyListItem
