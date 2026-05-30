import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from '../../redux/store';
import { formatCurrency, formatDisplayDate } from '../../utils/dateUtils';

const BRAND = '#02689B';
const ACTIVE = '#1DA1F2';
const BG = '#F9FAFB';
const CARD = '#FFFFFF';
const TEXT = '#111827';
const MUTED = '#6B7280';
const BORDER = '#E5E7EB';

export const ExpenseDetailScreen = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const expenseId = route.params?.expense?.id as string | undefined;
  const fallback = route.params?.expense;

  const expense = useSelector((state: RootState) =>
    expenseId
      ? state.expenses.expenses.find((e) => e.id === expenseId) ?? fallback
      : fallback,
  ) ?? { title: 'Unknown', amount: '0', date: '-', icon: '📝', iconBg: '#F3F4F6' };

  const amountValue = parseFloat((expense.amount || '0').replace(/,/g, ''));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: expense.iconBg || '#F3F4F6' }]}>
              <Text style={styles.icon}>{expense.icon || '📝'}</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.type}>{expense.title || 'Expense'}</Text>
              <Text style={styles.date}>{formatDisplayDate(expense.date)}</Text>
            </View>
          </View>

          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Total Amount</Text>
            <Text style={styles.amountValue}>
              {formatCurrency(Number.isNaN(amountValue) ? 0 : amountValue)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.label}>Submitted On</Text>
            <Text style={styles.value}>{formatDisplayDate(expense.date)}</Text>
          </View>

          {expense.vehicle ? (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Vehicle</Text>
              <Text style={styles.value}>{expense.vehicle}</Text>
            </View>
          ) : null}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Receipt</Text>
          <View style={styles.imageContainer}>
            <Icon name="image-off-outline" size={28} color={MUTED} />
            <Text style={styles.imagePlaceholderText}>Receipt not uploaded</Text>
          </View>
        </View>

        {expenseId ? (
          <TouchableOpacity
            style={styles.editBtn}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('EditExpense', { expenseId })}
          >
            <Icon name="pencil-outline" size={18} color="#FFFFFF" />
            <Text style={styles.editBtnText}>Edit Expense</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  content: { padding: 16 },
  card: {
    backgroundColor: CARD,
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 16,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  icon: { fontSize: 22 },
  headerText: { flex: 1 },
  type: { fontSize: 16, fontWeight: '700', color: TEXT, marginBottom: 4, lineHeight: 22 },
  date: { fontSize: 13, color: MUTED },
  amountBox: {
    backgroundColor: '#E8F4FC',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: { fontSize: 13, fontWeight: '500', color: BRAND },
  amountValue: { fontSize: 20, fontWeight: '700', color: ACTIVE },
  divider: { height: 1, backgroundColor: BORDER, marginVertical: 14 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { fontSize: 13, color: MUTED },
  value: { fontSize: 14, fontWeight: '600', color: TEXT },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: TEXT, marginBottom: 10 },
  imageContainer: {
    height: 140,
    backgroundColor: BG,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  imagePlaceholderText: { color: MUTED, fontSize: 13 },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACTIVE,
    borderRadius: 10,
    height: 48,
    gap: 8,
  },
  editBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
