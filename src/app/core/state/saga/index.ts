import { all } from 'redux-saga/effects';
import { rootSaga as authRootSaga } from './auth';
import dashboardRootSaga from './dashboard';

export function* rootSaga() {
  yield all([
    authRootSaga(),
    dashboardRootSaga(),
  ]);
}

export default rootSaga;
