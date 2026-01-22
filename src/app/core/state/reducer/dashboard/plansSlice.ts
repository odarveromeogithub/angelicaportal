import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Plan } from '../../../interfaces/dashboard.interface';

interface PlansState {
  plans: Plan[];
  filteredPlans: Plan[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  statusFilter: string;
}

const initialState: PlansState = {
  plans: [],
  filteredPlans: [],
  loading: false,
  error: null,
  searchQuery: '',
  statusFilter: 'all'
};

const plansSlice = createSlice({
  name: 'dashboard_plans',
  initialState,
  reducers: {
    fetchPlansRequest: (state) => {
      state.loading = true;
    },
    setPlans: (state, action: PayloadAction<Plan[]>) => {
      state.plans = action.payload;
      state.filteredPlans = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredPlans = state.plans.filter(plan =>
        plan.fullName.toLowerCase().includes(action.payload.toLowerCase()) ||
        plan.lpafNumber.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
      if (action.payload === 'all') {
        state.filteredPlans = state.plans;
      } else {
        state.filteredPlans = state.plans.filter(plan => plan.status === action.payload);
      }
    }
  }
});

export const plansActions = plansSlice.actions;
export default plansSlice.reducer;
