import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./reducer/auth/auth";
import {
  plansReducer,
  waitingListReducer,
  clientListReducer,
  agentListReducer,
  usersListReducer,
} from "./reducer/dashboard";
import { rootSaga } from "./saga/auth";
import dashboardRootSaga from "./saga/dashboard";

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["login", "user"], // Only persist login and user data
};

const persistedReducer = persistReducer(persistConfig, authReducer);

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Configure store
export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    dashboard_plans: plansReducer,
    dashboard_waitingList: waitingListReducer,
    dashboard_clientList: clientListReducer,
    dashboard_agentList: agentListReducer,
    dashboard_usersList: usersListReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(sagaMiddleware),
});

// Run the sagas
sagaMiddleware.run(rootSaga);
sagaMiddleware.run(dashboardRootSaga);

// Create persistor
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
