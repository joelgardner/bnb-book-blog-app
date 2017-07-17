import { call, put  } from 'redux-saga/effects'
import * as api from '../Api/ApolloProxy'
import {
  fetchEntitiesSuccess,
  fetchEntitiesError
} from '../Actions'

/**
  Map of each property type to its API method that retreives objects of that type.
*/
const API_ACTIONS_FOR_TYPE = {
  Property: 'listProperties'
}

/**
  Handles the fetching of lists of entities.
  @param {{ type: 'FETCH_ENTITIES', entityName: String, args: Object, searchParameters: Object }}
*/
export default function* fetchEntitiesSaga(action) {
  try {
    // get the appropriate API action for this type
    const apiAction = API_ACTIONS_FOR_TYPE[action.entityName]
    if (!apiAction) {
      throw new Error(`fetchEntities called with unknown entityName: ${action.entityName}`)
    }

    // call the API, get results
    const result = yield call(api[apiAction], action.args, action.searchParameters)

    // trigger a FETCH_ENTITIES_SUCCESS action, with the results and search params
    yield put(fetchEntitiesSuccess(
      action.entityName,
      result.data[apiAction],
      action.args,
      action.searchParameters
    ))
  }
  catch (e) {
    yield put(fetchEntitiesError(
      action.entityName,
      e.message,
      action.args,
      action.searchParameters
    ))
  }
}
