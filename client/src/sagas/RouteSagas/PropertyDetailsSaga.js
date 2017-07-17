import { all, put, takeEvery } from 'redux-saga/effects'
import fetchEntityDetailsSaga from '../FetchEntityDetailsSaga'

export default function* propertyDetailsSaga(location) {
  yield all([
    put({ type: 'FETCH_ENTITY_DETAILS', entityName: 'Property', args: { id: location.params.id } }),
    takeEvery('FETCH_ENTITY_DETAILS', fetchEntityDetailsSaga)
  ])
}
