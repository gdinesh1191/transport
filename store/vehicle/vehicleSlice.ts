import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Vehicle {
  id: number;
  registrationNumber: string;
  ownerName: string;
  modelYear: string;
  chasisNumber: string;
  status: string;
  truckType: string;
  npExpiryDate: string;
  truckStatus: string;
}

interface Filters {
  registrationNumber: string;
  ownerName: string;
  chasisNumber: string;
}

interface VehicleState {
  vehicles: Vehicle[];
  page: number;
  hasMore: boolean;
  scrollPosition: number;
  filters: Filters;
  searchTerm: string;
}

const initialState: VehicleState = {
  vehicles: [],
  page: 0,
  hasMore: true,
  scrollPosition: 0,
  filters: {
    registrationNumber: "",
    ownerName: "",
    chasisNumber: "",
  },
  searchTerm: "",
};

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {
    setVehicles(state, action: PayloadAction<Vehicle[]>) {
      state.vehicles = action.payload;
    },
    appendVehicles(state, action: PayloadAction<Vehicle[]>) {
      state.vehicles = [...state.vehicles, ...action.payload];
    },
    removeVehicle(state, action: PayloadAction<number[]>) {
      state.vehicles = state.vehicles.filter(
        (v) => !action.payload.includes(v.id)
      );
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setHasMore(state, action: PayloadAction<boolean>) {
      state.hasMore = action.payload;
    },
    setScrollPosition(state, action: PayloadAction<number>) {
      state.scrollPosition = action.payload;
    },
    setFilters(state, action: PayloadAction<Filters>) {
      state.filters = action.payload;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
  },
});

export const {
  setVehicles,
  appendVehicles,
  removeVehicle,
  setPage,
  setHasMore,
  setScrollPosition,
  setFilters,
  setSearchTerm,
} = vehicleSlice.actions;

export default vehicleSlice.reducer;
