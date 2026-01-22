import { all } from 'redux-saga/effects';
import { planSaga } from './planSaga';
import { waitingListSaga } from './waitingListSaga';
import { clientListSaga } from './clientListSaga';
import agentListSagaWatcher from './agentListSaga';
import usersListSagaWatcher from './usersListSaga';

export default function* dashboardRootSaga() {
  yield all([
    planSaga(),
    waitingListSaga(),
    clientListSaga(),
    agentListSagaWatcher(),
    usersListSagaWatcher(),
  ]);
}
