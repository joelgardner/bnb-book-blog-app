import { all, put, takeEvery } from 'redux-saga/effects'
import { fetchEntities } from '../../Actions'
import fetchEntitiesSaga from '../FetchEntitiesSaga'

export default function* homeSaga(location) {
  yield all([
    put(fetchEntities('Property', 'listProperties')),
    put(fetchEntities('Property', 'listProperties')),
    takeEvery('FETCH_ENTITIES', fetchEntitiesSaga('Property', 'listProperties'))
  ])
}
