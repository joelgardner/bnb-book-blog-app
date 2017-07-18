import { call, put, select  } from 'redux-saga/effects'
import * as api from '../Api/ApolloProxy'
import {
  fetchEntitiesSuccess,
  fetchEntitiesError
} from '../Actions'
import R from 'ramda'

/**
  Handles the fetching of lists of entities.
  @param {{ type: 'FETCH_ENTITIES', entityName: String, args: Object, searchParameters: Object }}
*/
export default function fetchEntitiesSaga(entityName, apiAction) {
  return function* (action) {
    const batchIndex = yield select(st => st.app[entityName].get('showing'))
    try {
      const result = yield call(
        api[apiAction],
        action.args,
        R.merge(action.searchParameters, { skip: 20 * batchIndex })
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
