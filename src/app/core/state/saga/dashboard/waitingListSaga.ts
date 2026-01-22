import { put, takeLatest, delay } from 'redux-saga/effects';
import { waitingListActions } from '../../reducer/dashboard/waitingListSlice';
import type { WaitingListItem } from '../../../interfaces/dashboard.interface';

function* fetchWaitingList(): Generator<any, void, any> {
  try {
    yield put(waitingListActions.setLoading(true));
    yield delay(600);
    
    const mockWaitingList: WaitingListItem[] = [
      {
        id: '1',
        policyNo: '0000000',
        lpafNo: 'E012230',
        name: 'Manuel Adorable De Ramos',
        status: 'Waiting for Payment/Approval'
      },
      {
        id: '2',
        policyNo: '0000000',
        lpafNo: 'E012229',
        name: 'Angelico Ramos Lomibao n/a',
        status: 'Waiting for Payment/Approval'
      },
      {
        id: '3',
        policyNo: '0000000',
        lpafNo: 'E012226',
        name: 'April Rose Decena Escalante April Rose Escalante',
        status: 'Waiting for Payment/Approval'
      },
      {
        id: '4',
        policyNo: '0000000',
        lpafNo: 'E012224',
        name: 'Lilia N/A Amit',
        status: 'Waiting for Payment/Approval'
      },
      {
        id: '5',
        policyNo: '0000000',
        lpafNo: 'E012223',
        name: 'Carlo Entoma Paz',
        status: 'Waiting for Payment/Approval'
      },
      {
        id: '6',
        policyNo: '0000000',
        lpafNo: 'E012222',
        name: 'Maura Serrano Liboro Iluminada Modalo Serrano',
        status: 'Waiting for Payment/Approval'
      },
      {
        id: '7',
        policyNo: '0000000',
        lpafNo: 'E012218',
        name: 'Venus Luague Encorporado',
        status: 'Waiting for Payment/Approval'
      },
      {
        id: '8',
        policyNo: '0000000',
        lpafNo: 'E012214',
        name: 'BELEN GUIDES PACLE',
        status: 'Waiting for Payment/Approval'
      }
    ];
    
    yield put(waitingListActions.setWaitingList(mockWaitingList));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch waiting list';
    yield put(waitingListActions.setError(errorMessage));
  } finally {
    yield put(waitingListActions.setLoading(false));
  }
}

export function* waitingListSaga() {
  yield takeLatest(waitingListActions.fetchWaitingListRequest.type, fetchWaitingList);
}
