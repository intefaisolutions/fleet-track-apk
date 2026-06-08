import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { updateExpense } from '../../redux/slices/expenseSlice';
import { CustomInput } from '../../components/CustomInput';
import { RootState } from '../../redux/store';
import { expenseService, getApiErrorMessage, unwrapApi } from '../../services/api';
import { mapExpenseToUi } from '../../utils/expenseMapper';
import { formatDisplayDate } from '../../utils/dateUtils';

const BRAND = '#02689B';
const ACTIVE = '#1DA1F2';
const BG = '#F9FAFB';
const TEXT = '#111827';
const MUTED = '#6B7280';
const BORDER = '#E5E7EB';

export const EditExpenseScreen = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const expenseId = route.params?.expenseId as string;

  const expense = useSelector((state: RootState) =>
    state.expenses.expenses.find((e) => e.id === expenseId),
  );

  const [title, setTitle] = useState(expense?.title ?? '');
  const [date, setDate] = useState(expense?.date ?? '');
  const [amount, setAmount] = useState(expense?.amount ?? '');
  const [saving, setSaving] = useState(false);

  if (!expense) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>Expense not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.emptyLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSave = async () => {
    if (!title.trim() || !date.trim() || !amount.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const parsed = parseFloat(amount.replace(/,/g, ''));
    if (Number.isNaN(parsed) || parsed < 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const expenseDate = date.trim().slice(0, 10);

    setSaving(true);
    try {
      const response = await expenseService.updateExpense(expenseId, {
        amount: parsed,
        description: title.trim(),
        expenseDate,
      });
      const updated = unwrapApi<Record<string, unknown>>(response);
      dispatch(updateExpense(mapExpenseToUi(updated)));
      Alert.alert('Success', 'Expense updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error, 'Failed to update expense'));
    } finally {
      setSaving(false);
    }
  };

  const inputProps = {
    labelStyle: styles.label,
    inputContainerStyle: styles.inputBox,
    inputStyle: styles.inputText,
    containerStyle: styles.field,
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.summaryCard}>
            <View style={[styles.iconWrap, { backgroundColor: expense.iconBg }]}>
              <Text style={styles.icon}>{expense.icon}</Text>
            </View>
            <View style={styles.summaryText}>
              <Text style={styles.summaryLabel}>Editing expense</Text>
              <Text style={styles.summaryDate}>{formatDisplayDate(expense.date)}</Text>
            </View>
          </View>

          <CustomInput
            label="Expense Title"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Indian Oil - Sector 62 (Fuel)"
            {...inputProps}
          />

          <CustomInput
            label="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
            placeholder="2026-05-29"
            {...inputProps}
          />

          <CustomInput
            label="Amount (₹)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="e.g. 3500"
            {...inputProps}
          />

          <View style={styles.readOnlyRow}>
            <Text style={styles.readOnlyLabel}>Vehicle</Text>
            <Text style={styles.readOnlyValue}>{expense.vehicle}</Text>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            activeOpacity={0.9}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Icon name="content-save-outline" size={18} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  flex: { flex: 1 },
  content: { padding: 16 },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 16,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: { fontSize: 20 },
  summaryText: { flex: 1 },
  summaryLabel: { fontSize: 14, fontWeight: '600', color: TEXT, marginBottom: 2 },
  summaryDate: { fontSize: 12, color: MUTED },
  field: { marginBottom: 12 },
  label: {
    fontSize: 11,
    color: MUTED,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  inputBox: {
    borderRadius: 8,
    height: 44,
    borderColor: BORDER,
  },
  inputText: { fontSize: 14, color: TEXT },
  readOnlyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 20,
  },
  readOnlyLabel: { fontSize: 13, color: MUTED },
  readOnlyValue: { fontSize: 14, fontWeight: '600', color: TEXT },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACTIVE,
    borderRadius: 10,
    height: 48,
    gap: 8,
    marginBottom: 10,
  },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelBtnText: { color: BRAND, fontSize: 14, fontWeight: '600' },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: BG },
  emptyText: { fontSize: 16, color: TEXT, marginBottom: 8 },
  emptyLink: { fontSize: 14, color: BRAND, fontWeight: '600' },
});
