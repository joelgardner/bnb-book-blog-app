import { call } from 'redux-saga/effects'
import homeSaga from './RouteSagas/HomeSaga'

const SAGA_FOR_ROUTE = {
  '/'                 : homeSaga,
  '/property/:id'     : function* propertyDetailSaga() {},
  '/room/:id'         : function* roomDetailSaga() {},
  '/manage'           : function* manage() {},
  '/manage/:id'       : function* manageProperty() {},
  '/manage/room/:id'  : function* manageRoom() {}
};

export default function* navigationSaga(action) {
  const location = action.payload;
  const saga = SAGA_FOR_ROUTE[location.route];

  if (saga) {
    yield call(saga, location);
  }
}
