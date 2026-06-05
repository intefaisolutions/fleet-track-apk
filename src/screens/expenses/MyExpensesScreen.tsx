import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from '../../redux/store';
import {
  formatDateRangeLabel,
  isDateInRange,
  type DateRangeFilter,
} from '../../utils/dateUtils';
import { CalendarDatePicker } from '../../components/CalendarDatePicker';
import { useDriverExpenses } from '../../hooks/useDriverExpenses';

const BRAND_DARK = '#02689B';
const BRAND_LIGHT = '#00A3E0'; // or bright blue like the screenshot
const BG_COLOR = '#F9FAFB'; // slightly lighter than Profile for the list area
const CARD_BG = '#FFFFFF';
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#6B7280';
const BORDER_COLOR = '#E5E7EB';

export const MyExpensesScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const { loading, error, refreshExpenses } = useDriverExpenses();
  const [filter, setFilter] = useState('All Categories');
  const [showDropdown, setShowDropdown] = useState(false);
  const [dateFilter, setDateFilter] = useState<'all' | DateRangeFilter>('all');
  const [showDateCalendar, setShowDateCalendar] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      refreshExpenses();
    }, [refreshExpenses]),
  );

  const filteredExpenses = expenses.filter(expense => {
    if (filter === 'All Categories') return true;
    const cat = (expense.category ?? '').toUpperCase();
    if (filter === 'Fuel') return cat === 'FUEL' || expense.title.includes('Fuel');
    if (filter === 'Toll') return cat === 'TOLL' || expense.title.includes('Toll');
    if (filter === 'Repair') return cat === 'REPAIR' || expense.icon === '🔧' || expense.title.includes('Repair');
    if (filter === 'Daily Report') return cat === 'OTHER' || expense.title.includes('Daily Report');
    return true;
  }).filter(expense => {
    if (dateFilter === 'all') return true;
    return isDateInRange(expense.date, dateFilter);
  });

  const calculateTotal = () => {
    return filteredExpenses.reduce((sum, item) => sum + parseFloat((item.amount || '0').replace(/,/g, '')), 0).toLocaleString();
  };

  const sortedExpenses = [...filteredExpenses].sort((a, b) => b.date.localeCompare(a.date));

  const dateFilterLabel =
    dateFilter === 'all' ? 'All Dates' : formatDateRangeLabel(dateFilter);

  const renderExpense = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('ExpenseDetail', { expense: item })}
    >
      <View style={styles.cardInner}>
        {/* Left Icon */}
        <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
          <Text style={styles.icon}>{item.icon}</Text>
        </View>

        {/* Middle Details */}
        <View style={styles.details}>
          <Text style={styles.date}>{item.date}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.vehicleTag}>
            <Text style={styles.vehicleTagText}>Vehicle: {item.vehicle}</Text>
          </View>
        </View>

        {/* Right Amount */}
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>₹{parseFloat((item.amount || '0').replace(/,/g, '')).toLocaleString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND_DARK} />

      {/* Top Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerLeft}>
          <Icon name="truck-outline" size={22} color="#FFFFFF" style={styles.logoIcon} />
          <Text style={styles.logoText}>FleetOps</Text>
        </View>
        <TouchableOpacity
          style={styles.bellBtn}
          activeOpacity={0.7}
          onPress={() => Alert.alert('Notifications', 'No new notifications')}
        >
          <Icon name="bell-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.pageTitle}>My Expenses</Text>

        {/* Total Spend Card */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>TOTAL SPEND</Text>
          <Text style={styles.totalAmount}>₹{calculateTotal()}</Text>
          <Text style={styles.totalMonth}>March 2026</Text>
        </View>

        {/* Filters */}
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.dropdownBtn} onPress={() => setShowDropdown(true)}>
            <Text style={styles.dropdownText}>{filter}</Text>
            <Text style={styles.dropdownIcon}>˅</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDateCalendar(true)}>
            <Text style={styles.calendarIcon}>📅</Text>
            <Text style={styles.dateText}>{dateFilterLabel}</Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        {loading && expenses.length === 0 ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color={BRAND_DARK} />
          </View>
        ) : null}

        {error ? (
          <TouchableOpacity style={styles.errorBox} onPress={refreshExpenses}>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.retryText}>Tap to retry</Text>
          </TouchableOpacity>
        ) : null}

        <FlatList
          data={sortedExpenses}
          keyExtractor={item => item.id}
          renderItem={renderExpense}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !loading ? (
              <Text style={styles.emptyText}>No expenses yet. Add your first expense.</Text>
            ) : null
          }
        />
      </View>

      {/* Dropdown Modal */}
      <Modal visible={showDropdown} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowDropdown(false)}>
          <View style={styles.dropdownMenu}>
            {['All Categories', 'Fuel', 'Toll', 'Repair', 'Daily Report'].map(cat => (
              <TouchableOpacity 
                key={cat} 
                style={styles.dropdownItem} 
                onPress={() => { setFilter(cat); setShowDropdown(false); }}
              >
                <Text style={[styles.dropdownItemText, filter === cat && styles.dropdownItemTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <CalendarDatePicker
        visible={showDateCalendar}
        onClose={() => setShowDateCalendar(false)}
        selectedValue={dateFilter}
        onApply={setDateFilter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND_DARK },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: BRAND_DARK,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { marginRight: 8 },
  logoText: { fontSize: 17, fontWeight: '600', color: '#FFFFFF', letterSpacing: 0.2 },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16, backgroundColor: '#FFFFFF' },
  pageTitle: { fontSize: 16, color: TEXT_DARK, marginBottom: 16 },

  // Total Card
  totalCard: {
    backgroundColor: '#1DA1F2', // Match the bright blue in the screenshot
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  totalLabel: { color: '#FFFFFF', fontSize: 12, letterSpacing: 1, marginBottom: 4 },
  totalAmount: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  totalMonth: { color: '#FFFFFF', fontSize: 14 },

  // Filters
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  dropdownBtn: { 
    flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: BORDER_COLOR, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10,
    marginRight: 12, backgroundColor: CARD_BG
  },
  dropdownText: { color: TEXT_DARK, fontSize: 14 },
  dropdownIcon: { color: TEXT_DARK, fontSize: 14 },
  
  dateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: CARD_BG,
    maxWidth: '48%',
  },
  calendarIcon: { fontSize: 14, marginRight: 6 },
  dateText: { color: TEXT_DARK, fontSize: 13, flexShrink: 1 },

  // List
  list: { paddingBottom: 20 },
  card: { 
    backgroundColor: CARD_BG, 
    borderRadius: 8, 
    borderWidth: 1, borderColor: BORDER_COLOR,
    marginBottom: 12,
  },
  cardInner: { flexDirection: 'row', padding: 16 },
  
  iconContainer: { 
    width: 44, height: 44, borderRadius: 22, 
    justifyContent: 'center', alignItems: 'center', 
    marginRight: 16 
  },
  icon: { fontSize: 20 },
  
  details: { flex: 1, justifyContent: 'center' },
  date: { fontSize: 13, color: TEXT_MUTED, marginBottom: 4 },
  title: { fontSize: 15, fontWeight: '600', color: TEXT_DARK, marginBottom: 8, lineHeight: 20 },
  vehicleTag: { 
    backgroundColor: '#F3F4F6', 
    paddingHorizontal: 8, paddingVertical: 4, 
    borderRadius: 4, alignSelf: 'flex-start' 
  },
  vehicleTagText: { fontSize: 12, color: TEXT_MUTED },
  
  amountContainer: { justifyContent: 'flex-start' },
  amount: { fontSize: 16, fontWeight: 'bold', color: BRAND_DARK },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  dropdownMenu: { backgroundColor: CARD_BG, width: '80%', borderRadius: 12, padding: 8, elevation: 5 },
  dropdownItem: { paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: BORDER_COLOR },
  dropdownItemText: { fontSize: 15, color: TEXT_DARK },
  dropdownItemTextActive: { color: BRAND_DARK, fontWeight: 'bold' },
  loaderBox: { paddingVertical: 40, alignItems: 'center' },
  errorBox: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: { color: '#B91C1C', fontSize: 13 },
  retryText: { color: BRAND_DARK, fontWeight: '600', marginTop: 4, fontSize: 12 },
  emptyText: { textAlign: 'center', color: TEXT_MUTED, paddingVertical: 32, fontSize: 14 },
});
