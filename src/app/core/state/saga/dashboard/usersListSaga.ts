import { put, takeLatest, delay } from 'redux-saga/effects';
import { usersListActions } from '../../reducer/dashboard/usersListSlice';
import type { SystemUser } from '../../../interfaces/dashboard.interface';

// Mock data for system users
const mockUsers: SystemUser[] = [
  {
    id: '1',
    username: 'cclpi_gio',
    name: 'Gio Perez',
    agentCode: 'M-000-00-000-00000',
    userType: 'ADMIN',
    contactNo: '639277035642',
  },
  {
    id: '2',
    username: 'rome0',
    name: 'Romeo Odarve',
    agentCode: 'M-000-00-000-00000',
    userType: 'ADMIN',
    contactNo: '639171209981',
  },
  {
    id: '3',
    username: 'M02168',
    name: 'AGENT PORTAL',
    agentCode: 'M-000-00-000-02168',
    userType: 'SC',
    contactNo: '639',
  },
  {
    id: '4',
    username: 'V01618',
    name: 'Area Office - Antique',
    agentCode: 'V-005-60-000-01618',
    userType: 'SC',
    contactNo: '639',
  },
  {
    id: '5',
    username: 'V00820',
    name: 'Area Office - Bacolod',
    agentCode: 'V-005-60-000-00820',
    userType: 'SC',
    contactNo: '639',
  },
  {
    id: '6',
    username: 'M02153',
    name: 'Area Office - Caraga',
    agentCode: 'M-005-46-000-02153',
    userType: 'SC',
    contactNo: '639',
  },
  {
    id: '7',
    username: 'M00445',
    name: 'Area Office - Davao',
    agentCode: 'M-005-46-000-00445',
    userType: 'SC',
    contactNo: '639',
  },
  {
    id: '8',
    username: 'V00726',
    name: 'Area office - Dumaguete',
    agentCode: 'V-005-60-000-00726',
    userType: 'SC',
    contactNo: '639',
  },
  {
    id: '9',
    username: 'M00357',
    name: 'CCLPI Mindanao',
    agentCode: 'M-000-00-000-00357',
    userType: 'SC',
    contactNo: '639',
  },
  {
    id: '10',
    username: 'M00892',
    name: 'CCLPI Mindanao (Bukidnon)',
    agentCode: 'M-000-00-000-00892',
    userType: 'SC',
    contactNo: '639',
  },
];

function* fetchUsersListSaga() {
  try {
    // Simulate API call
    yield delay(500);
    yield put(usersListActions.fetchUsersListSuccess(mockUsers));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
    yield put(usersListActions.fetchUsersListFailure(errorMessage));
  }
}

export default function* usersListSagaWatcher() {
  yield takeLatest(usersListActions.fetchUsersListRequest.type, fetchUsersListSaga);
}
