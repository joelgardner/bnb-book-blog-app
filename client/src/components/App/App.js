import React from 'react'
import PropertyListContainer from '../PropertyList/PropertyListContainer'
import PropertyDetailsContainer from '../PropertyDetails/PropertyDetailsContainer'
import { Fragment } from 'redux-little-router'

const App = () =>
  <Fragment forRoute='/' >
    <div className="container is-fluid">
      <Fragment forRoute='/'>
        <PropertyListContainer />
      </Fragment>
      <Fragment forRoute='/property/:id'>
        <PropertyDetailsContainer />
      </Fragment>
    </div>
  </Fragment>
export default App
