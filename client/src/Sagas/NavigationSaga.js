import { call } from 'redux-saga/effects'
import invalidRouteSaga from './RouteSagas/InvalidRouteSaga'

export default function* navigationSaga(action) {
  const location = action.payload
  const saga = location.result.saga || invalidRouteSaga
  yield call(saga, location)
}
