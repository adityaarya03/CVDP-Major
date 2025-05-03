// src/redux/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './Slices/authSlice';
import predictionReducer from './Slices/predictionSlice';
import historyReducer from './Slices/historySlice';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import storage from 'redux-persist/lib/storage'; // uses localStorage

const rootReducer = combineReducers({
  auth: authReducer,
  prediction: predictionReducer,
  history: historyReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // ✅ Only persist auth, not prediction/history
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // required for redux-persist compatibility
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);