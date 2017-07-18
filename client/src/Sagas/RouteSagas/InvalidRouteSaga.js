import { call } from 'redux-saga/effects'
import { displayError } from '../../Actions'

export default function* invalidRouteSaga(location) {
  yield call(displayError('This page does not exist.'))
}
