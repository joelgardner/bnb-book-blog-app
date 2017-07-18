import { all, put, takeEvery, select } from 'redux-saga/effects'
import { fetchEntities } from '../../Actions'
import fetchEntitiesSaga from '../FetchEntitiesSaga'

const TYPE_NAME = 'Property'
const API_ACTION = 'listProperties'

export default function* homeSaga(location) {
  yield takeEvery('FETCH_ENTITIES', fetchEntitiesSaga(TYPE_NAME, API_ACTION))
  const showing = yield select(s => s.app.Property.get('showing'))
  if (showing === -1) {
    yield all([
      put(fetchEntities(TYPE_NAME, API_ACTION)),
      put(fetchEntities(TYPE_NAME, API_ACTION))
    ])
  }
}
