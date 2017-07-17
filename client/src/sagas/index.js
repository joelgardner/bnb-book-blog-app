import { all, takeLatest } from 'redux-saga/effects'
import navigationSaga from './NavigationSaga'

export default function* rootSaga() {
  yield all([
    takeLatest('ROUTER_LOCATION_CHANGED', navigationSaga),
  ]);
}
