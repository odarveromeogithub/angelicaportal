import { put, takeLatest, delay } from 'redux-saga/effects';
import { agentListActions } from '../../reducer/dashboard/agentListSlice';
import type { Agent } from '../../../interfaces/dashboard.interface';

// Mock data for agents
const mockAgents: Agent[] = [
  {
    id: '1',
    salesCounselorCode: '0',
    name: 'Unknown',
    scStatus: 'Expired',
  },
  {
    id: '2',
    salesCounselorCode: 'M-000-00-000-00000',
    name: 'DIRECT OPERATION CCLPI',
    scStatus: 'Active',
  },
  {
    id: '3',
    salesCounselorCode: 'M-005-46-000-00001',
    name: 'Ruth Thelma Loking',
    scStatus: 'Expired',
  },
  {
    id: '4',
    salesCounselorCode: 'M-005-46-000-00002',
    name: 'Diego Palacat',
    scStatus: 'Expired',
  },
  {
    id: '5',
    salesCounselorCode: 'M-005-46-000-00003',
    name: 'Alejandro Responte',
    scStatus: 'Expired',
  },
  {
    id: '6',
    salesCounselorCode: 'L-005-59-000-00004',
    name: 'Karen Caslangan',
    scStatus: 'Expired',
  },
  {
    id: '7',
    salesCounselorCode: 'L-005-59-000-00005',
    name: 'Ivy Laurente',
    scStatus: 'Expired',
  },
  {
    id: '8',
    salesCounselorCode: 'M-005-46-000-00006',
    name: 'Jocelyn Duka Bautista',
    scStatus: 'Expired',
  },
  {
    id: '9',
    salesCounselorCode: 'L-005-59-000-00007',
    name: 'Jobelle R. Pannig',
    scStatus: 'Expired',
  },
  {
    id: '10',
    salesCounselorCode: 'L-005-59-000-00008',
    name: 'Sacred Dela peña',
    scStatus: 'Expired',
  },
];

function* fetchAgentListSaga() {
  try {
    // Simulate API call
    yield delay(500);
    yield put(agentListActions.fetchAgentListSuccess(mockAgents));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch agents';
    yield put(agentListActions.fetchAgentListFailure(errorMessage));
  }
}

export default function* agentListSagaWatcher() {
  yield takeLatest(agentListActions.fetchAgentListRequest.type, fetchAgentListSaga);
}
