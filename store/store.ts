import { configureStore } from '@reduxjs/toolkit';
import vehicleReducer from '././vehicle/vehicleSlice';
import expenseReducer from '././expense/expenseSlice';

export const store = configureStore({
  reducer: {
    vehicle: vehicleReducer,
    expense:expenseReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
