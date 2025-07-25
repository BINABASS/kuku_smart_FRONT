import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import devicesReducer from './devicesSlice';
import sensorsReducer from './sensorsSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
  timeout: 5000,
};

const rootReducer = combineReducers({
  auth: authReducer,
  devices: devicesReducer,
  sensors: sensorsReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});