import { configureStore } from '@reduxjs/toolkit';
import vehicleReducer from '././vehicle/vehicleSlice';

export const store = configureStore({
  reducer: {
    vehicle: vehicleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
