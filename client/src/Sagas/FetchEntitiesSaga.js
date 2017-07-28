import { call, put, select  } from 'redux-saga/effects'
import * as api from '../Api/ApolloProxy'
import { FETCH_LIMIT } from '../Constants'
import {
  fetchEntitiesSuccess,
  fetchEntitiesError,
  showMore
} from '../Actions'
import R from 'ramda'

export default function fetchEntitiesSaga(entityName, apiAction) {
  return function* (action) {
    yield put(showMore())
    const batchIndex = yield select(st => st.app[entityName].get('showing'))
    try {
      const result = yield call(
        api[apiAction],
        action.args,
        R.merge(action.searchParameters, { skip: FETCH_LIMIT * batchIndex })
      )
      yield put(fetchEntitiesSuccess(
        action.entityName,
        result.data[apiAction],
        batchIndex
      ))
    }
    catch (e) {
      yield put(fetchEntitiesError(
        action.entityName,
        e.message,
        batchIndex
      ))
    }
  }
}
