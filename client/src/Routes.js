import homeSaga from './Sagas/RouteSagas/HomeSaga'
import propertyDetailsSaga from './Sagas/RouteSagas/PropertyDetailsSaga'

const routes = {
  '/': {
    title: 'Properties',
    saga: homeSaga
  },
  '/property/:id' : {
    title: 'Property Details',
    saga: propertyDetailsSaga
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

export default routes
