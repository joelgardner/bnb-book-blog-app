import { put, takeEvery } from 'redux-saga/effects'
import fetchEntityDetailsSaga from '../FetchEntityDetailsSaga'
import { fetchEntityDetails } from '../../Actions'

export default function* propertyDetailsSaga(location) {
  yield takeEvery('FETCH_ENTITY_DETAILS', fetchEntityDetailsSaga('Property', 'fetchProperty'))
  yield put(fetchEntityDetails('Property', 'fetchProperty', { id: location.params.id }))
}
