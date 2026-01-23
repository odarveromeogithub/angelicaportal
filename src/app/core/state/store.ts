import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./reducer/auth/auth";
import { baseApi } from "./api";
import { rootSaga } from "./saga/auth";

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
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    })
    .concat(sagaMiddleware)
    .concat(baseApi.middleware),
});

// Run the sagas
sagaMiddleware.run(rootSaga);

// Create persistor
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
