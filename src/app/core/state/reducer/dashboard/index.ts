/**
 * Dashboard Reducer Index
 * Central export point for all dashboard slice reducers and actions
 */

export { default as plansReducer, plansActions } from './plansSlice';
export { default as waitingListReducer, waitingListActions } from './waitingListSlice';
export { default as clientListReducer, clientListActions } from './clientListSlice';
export { default as agentListReducer, agentListActions } from './agentListSlice';
export { default as usersListReducer, usersListActions } from './usersListSlice';
