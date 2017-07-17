import { call } from 'redux-saga/effects'
import homeSaga from './RouteSagas/HomeSaga'
import propertyDetailsSaga from './RouteSagas/PropertyDetailsSaga'
import invalidRouteSaga from './RouteSagas/InvalidRouteSaga'

const SAGA_FOR_ROUTE = {
  '/'                 : homeSaga,
  '/property/:id'     : propertyDetailsSaga,
  '/room/:id'         : function* roomDetailSaga() {},
  '/manage'           : function* manage() {},
  '/manage/:id'       : function* manageProperty() {},
  '/manage/room/:id'  : function* manageRoom() {}
};

export default function* navigationSaga(action) {
  const location = action.payload;
  const saga = SAGA_FOR_ROUTE[location.route] || invalidRouteSaga;

  if (saga) {
    yield call(saga, location);
  }
}
