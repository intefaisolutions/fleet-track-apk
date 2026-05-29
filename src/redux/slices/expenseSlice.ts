import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Expense {
  id: string;
  title: string;
  date: string;
  amount: string;
  vehicle: string;
  icon: string;
  iconBg: string;
}

interface ExpenseState {
  expenses: Expense[];
}

const initialState: ExpenseState = {
  expenses: [
    { 
      id: '1', 
      title: 'Indian Oil, NH-48', 
      date: '2026-05-25', 
      amount: '3450', 
      vehicle: 'HR26AB1234', 
      icon: '⛽', 
      iconBg: '#E0F2FE'
    },
    { 
      id: '2', 
      title: 'Brake Pad Replacement', 
      date: '2026-05-20', 
      amount: '7200', 
      vehicle: 'HR26AB1234', 
      icon: '🔧', 
      iconBg: '#F3F4F6'
    },
    { 
      id: '3', 
      title: 'Toll - Delhi-Jaipur Exp', 
      date: '2026-05-15', 
      amount: '850', 
      vehicle: 'HR26AB1234', 
      icon: '🛣️', 
      iconBg: '#F3F4F6' 
    },
  ],
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<Expense>) => {
      // Add to beginning of array
      state.expenses.unshift(action.payload);
    },
  },
});

export const { addExpense } = expenseSlice.actions;
export default expenseSlice.reducer;
