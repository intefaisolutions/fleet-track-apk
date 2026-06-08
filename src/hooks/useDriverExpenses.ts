import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { expenseService, getApiErrorMessage, unwrapApi } from '../services/api';
import { setExpenses } from '../redux/slices/expenseSlice';
import { store } from '../redux/store';
import { mapExpensesToUi } from '../utils/expenseMapper';

export function useDriverExpenses() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await expenseService.getMyExpenses();
      const data = unwrapApi<unknown>(response);
      const mapped = mapExpensesToUi(data);
      const current = store.getState().expenses.expenses;

      if (mapped.length === 0 && current.length > 0) {
        // API returned empty but we have locally added items — don't wipe the list
        return;
      }

      if (mapped.length > 0) {
        const apiIds = new Set(mapped.map((item) => item.id));
        const localOnly = current.filter((item) => !apiIds.has(item.id));
        dispatch(setExpenses([...mapped, ...localOnly]));
        return;
      }

      dispatch(setExpenses(mapped));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load expenses'));
      // Keep existing Redux expenses when refresh fails
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return { loading, error, refreshExpenses };
}
