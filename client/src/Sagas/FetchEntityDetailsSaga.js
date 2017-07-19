import { call, put  } from 'redux-saga/effects'
import * as api from '../Api/ApolloProxy'
import {
  fetchEntityDetailsSuccess,
  fetchEntityDetailsError
} from '../Actions'

export default function fetchEntityDetailsSaga(entityName, apiAction) {
  return function* (action) {
    try {
      const result = yield call(api[apiAction], action.args)
      yield put(fetchEntityDetailsSuccess(
        action.entityName,
        result.data[apiAction],
        action.args
      ))
    }
    catch (e) {
      yield put(fetchEntityDetailsError(
        action.entityName,
        e.message,
        action.args
      ))
    }
  }
}
