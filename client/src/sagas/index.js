import { takeLatest, call, all, put } from 'redux-saga/effects'
import api from '../api'
import {
  fetchEntitiesSuccess,
  fetchEntitiesError
} from '../actions'

const SAGA_FOR_ROUTE = {
  '/':                homeSaga,
  '/property/:id':    function* propertyDetailSaga() {},
  '/room/:id':        function* roomDetailSaga() {},
  '/manage':          function* manage() {},
  '/manage/:id':      function* manageProperty() {},
  '/manage/room/:id': function* manageRoom() {}
};

function* homeSaga(location) {
  try {
    const result = yield call(api.listProperties)
    yield put(fetchEntitiesSuccess('Property', result.data.listProperties))
  }
  catch (e) {
    yield put(fetchEntitiesError('Property', e.message))
  }
}

function* navigationSaga(action) {
  const location = action.payload;
  const saga = SAGA_FOR_ROUTE[location.route];

  if (saga) {
    yield call(saga, location);
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest("ROUTER_LOCATION_CHANGED", navigationSaga),
  ]);
}
