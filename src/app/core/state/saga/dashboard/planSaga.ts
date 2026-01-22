import { call, put, takeLatest } from 'redux-saga/effects';
import { plansActions } from '../../reducer/dashboard/plansSlice';
import { dashboardApi } from '../../../services/dashboard';
import type { Plan } from '../../../interfaces/dashboard.interface';

function* fetchPlans(): Generator<any, void, any> {
  try {
    yield put(plansActions.setLoading(true));
    
    // Call the real API service
    const plans: Plan[] = yield call(dashboardApi.fetchPlans);
    
    yield put(plansActions.setPlans(plans));
  } catch (error: unknown) {
    // For development: fall back to mock data if API fails
    if (import.meta.env.DEV) {
      // Log only in development - commented out to avoid unused variable
      // const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      // Silently use mock data
      const mockPlans: Plan[] = [
        {
          id: '1',
          lpafNumber: '02-12312312',
          fullName: 'Juan Dela Cruz Jr.',
          status: 'Lapsed' as const,
          contractPrice: 30000,
          planType: 'Angelica Life Plan 5',
          modeOfPayment: 'Monthly',
          termOfPayment: 'Installment',
          installment: 540,
          docStamp: 60,
          dateOfBirth: 'January 10, 1995',
          gender: 'Male',
          civilStatus: 'Single',
          email: 'JuanDelaCruz01@gmail.com',
          contactNumber: '+63 945367823',
          address: '#221, Hayes Street, Barangay 27, Cagayan de Oro City, Misamis Oriental, 9000'
        },
        {
          id: '2',
          lpafNumber: '02-12312313',
          fullName: 'Maria Santos',
          status: 'Active' as const,
          contractPrice: 25000,
          planType: 'Angelica Life Plan 3',
          modeOfPayment: 'Quarterly',
          termOfPayment: 'Installment',
          installment: 450,
          docStamp: 50,
          dateOfBirth: 'March 15, 1992',
          gender: 'Female',
          civilStatus: 'Married',
          email: 'maria.santos@gmail.com',
          contactNumber: '+63 912345678',
          address: '#123, Main Street, Quezon City, Metro Manila, 1100'
        },
        {
          id: '3',
          lpafNumber: '02-12312314',
          fullName: 'Pedro Reyes',
          status: 'Active' as const,
          contractPrice: 35000,
          planType: 'Angelica Life Plan 7',
          modeOfPayment: 'Monthly',
          termOfPayment: 'Installment',
          installment: 620,
          docStamp: 70,
          dateOfBirth: 'July 22, 1988',
          gender: 'Male',
          civilStatus: 'Single',
          email: 'pedro.reyes@gmail.com',
          contactNumber: '+63 923456789',
          address: '#456, Rizal Avenue, Makati City, Metro Manila, 1200'
        },
        {
          id: '4',
          lpafNumber: '02-12312315',
          fullName: 'Ana Rodriguez',
          status: 'Pending' as const,
          contractPrice: 28000,
          planType: 'Angelica Life Plan 4',
          modeOfPayment: 'Monthly',
          termOfPayment: 'Installment',
          installment: 500,
          docStamp: 55,
          dateOfBirth: 'November 8, 1990',
          gender: 'Female',
          civilStatus: 'Single',
          email: 'ana.rodriguez@gmail.com',
          contactNumber: '+63 934567890',
          address: '#789, Bonifacio Street, Davao City, 8000'
        }
      ];
      yield put(plansActions.setPlans(mockPlans));
    } else {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch plans';
      yield put(plansActions.setError(errorMessage));
    }
  } finally {
    yield put(plansActions.setLoading(false));
  }
}

export function* planSaga() {
  yield takeLatest(plansActions.fetchPlansRequest.type, fetchPlans);
}

