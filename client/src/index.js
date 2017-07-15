import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App/App'
import registerServiceWorker from './registerServiceWorker'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
//import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import reducer from './reducers'
import sagas from './sagas'
import './index.css'


const client = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: 'http://localhost:3000/graphql' }),
})
const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  combineReducers({
    ...reducer,
    apollo: client.reducer(),
  }),
  {}, // initial state
  compose(
      applyMiddleware(client.middleware()),
      //applyMiddleware(sagaMiddleware),
      // If you are using the devToolsExtension, you can add it here also
      //(typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
  )
);

//sagaMiddleware.run(sagas)


ReactDOM.render(
  //<Provider store={store}>
  <ApolloProvider store={store} client={client}>
    <App />
  </ApolloProvider>,
  //</Provider>,
  document.getElementById('root')
)
registerServiceWorker()

if (module.hot) {
  module.hot.accept('./components/App/App', () => {
    const NextApp = require('./components/App/App').default
    ReactDOM.render(
      //<Provider store={store}>
      <ApolloProvider client={client}>
        <NextApp />
      </ApolloProvider>,
      //</Provider>,
      document.getElementById('root')
    )
  })
}
