import React from 'react'
import ReactDOM from 'react-dom'
import App from './Components/App/App'
import registerServiceWorker from './registerServiceWorker'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
//import reducer from './Reducers'
import entitiesReducer from './Reducers/Entities'
import rootSaga from './Sagas/RootSaga'
import './index.css'
import { apolloClient } from './Api/ApolloProxy'
import { routerForBrowser, initializeCurrentLocation } from 'redux-little-router';

// define our routes
const routes = {
  '/': {
    title: 'Properties'
  },
  '/property/:id' : {
    title: 'Property Details'
  },
  '/room/:id': {
    title: 'Room details'
  },
  '/manage': {
    title: 'Manage Properties',
    '/:id': {
      title: 'Manage Property'
    },
    '/room/:id': {
      title: 'Manage Room'
    }
  }
}

// initialize our router
const {
  reducer     : routerReducer,
  middleware  : routerMiddleware,
  enhancer    : routerEnhancer
} = routerForBrowser({ routes })

// build our store
const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  combineReducers({
    app     : entitiesReducer,
    router  : routerReducer,
    apollo  : apolloClient.reducer()
  }),
  {}, // initial state
  compose(
    routerEnhancer,
    applyMiddleware(sagaMiddleware, routerMiddleware, apolloClient.middleware()),
    (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
  )
);

// kick off rootSaga
sagaMiddleware.run(rootSaga)

// render app
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()

// hot-reloading
if (module.hot) {
  module.hot.accept('./Components/App/App', () => {
    const NextApp = require('./Components/App/App').default
    ReactDOM.render(
      <Provider store={store}>
        <NextApp />
      </Provider>,
      document.getElementById('root')
    )
  })
}

// bootstrap the router with initial location
const initialLocation = store.getState().router;
if (initialLocation) {
  store.dispatch(initializeCurrentLocation(initialLocation));
}
