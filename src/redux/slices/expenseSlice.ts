import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Expense {
  id: string;
  title: string;
  date: string;
  amount: string;
  vehicle: string;
  icon: string;
  iconBg: string;
  category?: string;
  receiptUrl?: string;
}

interface ExpenseState {
  expenses: Expense[];
}

const initialState: ExpenseState = {
  expenses: [],
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.expenses = action.payload;
    },
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.expenses.unshift(action.payload);
    },
    updateExpense: (state, action: PayloadAction<Expense>) => {
      const index = state.expenses.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
    },
    clearExpenses: (state) => {
      state.expenses = [];
    },
  },
});

export const { setExpenses, addExpense, updateExpense, clearExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;
