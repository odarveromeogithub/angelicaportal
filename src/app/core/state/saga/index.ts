import { all } from 'redux-saga/effects';
import { rootSaga as authRootSaga } from './auth';

export function* rootSaga() {
  yield all([
    authRootSaga(),
  ]);
}

export default rootSaga;
