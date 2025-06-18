import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Expense {
  id: number;
  tripSheetId: string;
  expenseCategory: string;
  amount: string;
  remarks: string;
  expenseDate: string;
  expenseStatus?:string
}

interface Filters {
  expenseDate: string;
  expenseCategory: string | null;
  paymentMethod: string;
}

interface ExpenseState {
  expense: Expense[];
  page: number;
  hasMore: boolean;
  scrollPosition: number;
  filters: Filters;
  searchTerm: string;
}

const initialState: ExpenseState = {
  expense: [],
  page: 0,
  hasMore: true,
  scrollPosition: 0,
  filters: {
    expenseDate: "",
    expenseCategory: "",
    paymentMethod: "",
  },
  searchTerm: "",
};

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    setExpense(state, action: PayloadAction<Expense[]>) {
      state.expense = action.payload;
    },
    appendExpense(state, action: PayloadAction<Expense[]>) {
      state.expense = [...state.expense, ...action.payload];
    },
    removeExpense(state, action: PayloadAction<number[]>) {
      state.expense = state.expense.filter(
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
  setExpense,
  appendExpense,
  removeExpense,
  setPage,
  setHasMore,
  setScrollPosition,
  setFilters,
  setSearchTerm,
} = expenseSlice.actions;

export default expenseSlice.reducer;
