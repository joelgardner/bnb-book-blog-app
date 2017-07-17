import { all, put, takeEvery } from 'redux-saga/effects'
import fetchEntitiesSaga from '../FetchEntitiesSaga'

export default function* homeSaga(location) {
  yield all([
    put({ type: 'FETCH_ENTITIES', entityName: 'Property' }),
    takeEvery('FETCH_ENTITIES', fetchEntitiesSaga)
  ])
}
