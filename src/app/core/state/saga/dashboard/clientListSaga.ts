import { takeLatest, put, delay } from 'redux-saga/effects';
import { clientListActions } from '../../reducer/dashboard/clientListSlice';
import type { ClientPlan } from '../../../interfaces/dashboard.interface';

// Mock data for client plans
const mockClientPlans: ClientPlan[] = [
  {
    id: '1',
    lpafNo: '02-12312312',
    policyNo: '02-12312312',
    name: 'Juan Dela Cruz Jr.',
    status: 'Lapsed' as const,
    contractPrice: 'P 30,000',
    planType: 'Angelica Life Plan 5',
    modeOfPayment: 'Monthly',
    termOfPayment: 'Installment',
    installment: 'P 540.00',
    docStamp: 'P 60.00',
    dateOfBirth: 'January 10, 1995',
    gender: 'Male',
    civilStatus: 'Single',
    email: 'JuanDelaCruz01@gmail.com',
    contactNumber: '+63 945367823',
    address: '#221, Hayes Street, Barangay 27, Cagayan de Oro City, Misamis Oriental, 9000',
  },
  {
    id: '2',
    lpafNo: '02-12312313',
    policyNo: '02-12312313',
    name: 'Maria Santos',
    status: 'Active' as const,
    contractPrice: 'P 50,000',
    planType: 'Angelica Life Plan 10',
    modeOfPayment: 'Quarterly',
    termOfPayment: 'Installment',
    installment: 'P 1,250.00',
    docStamp: 'P 100.00',
    dateOfBirth: 'March 15, 1988',
    gender: 'Female',
    civilStatus: 'Married',
    email: 'maria.santos@gmail.com',
    contactNumber: '+63 912345678',
    address: '#45, Main Street, Barangay 12, Manila City, Metro Manila, 1000',
  },
  {
    id: '3',
    lpafNo: '02-12312314',
    policyNo: '02-12312314',
    name: 'Pedro Reyes',
    status: 'Active' as const,
    contractPrice: 'P 75,000',
    planType: 'Angelica Life Plan 15',
    modeOfPayment: 'Monthly',
    termOfPayment: 'Installment',
    installment: 'P 1,350.00',
    docStamp: 'P 150.00',
    dateOfBirth: 'July 22, 1992',
    gender: 'Male',
    civilStatus: 'Single',
    email: 'pedro.reyes@yahoo.com',
    contactNumber: '+63 923456789',
    address: '#78, Rizal Avenue, Barangay 5, Davao City, Davao del Sur, 8000',
  },
  {
    id: '4',
    lpafNo: '02-12312315',
    policyNo: '02-12312315',
    name: 'Ana Garcia',
    status: 'Pending' as const,
    contractPrice: 'P 40,000',
    planType: 'Angelica Life Plan 7',
    modeOfPayment: 'Monthly',
    termOfPayment: 'Installment',
    installment: 'P 720.00',
    docStamp: 'P 80.00',
    dateOfBirth: 'November 5, 1990',
    gender: 'Female',
    civilStatus: 'Married',
    email: 'ana.garcia@gmail.com',
    contactNumber: '+63 934567890',
    address: '#123, Bonifacio Street, Barangay 8, Cebu City, Cebu, 6000',
  },
];

function* fetchClientListSaga() {
  try {
    yield delay(800);
    yield put(clientListActions.fetchClientListSuccess(mockClientPlans));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error fetching client list:', error);
    }
  }
}

export function* clientListSaga() {
  yield takeLatest(clientListActions.fetchClientListRequest.type, fetchClientListSaga);
}
