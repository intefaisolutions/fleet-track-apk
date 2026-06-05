import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { expenseService, getApiErrorMessage, unwrapApi } from '../services/api';
import { setExpenses } from '../redux/slices/expenseSlice';
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
      const items = unwrapApi<Record<string, unknown>[]>(response);
      dispatch(setExpenses(mapExpensesToUi(items ?? [])));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load expenses'));
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return { loading, error, refreshExpenses };
}
