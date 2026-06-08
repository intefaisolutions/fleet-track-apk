import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from '../../redux/store';
import { mergeDriverProfile } from '../../constants/driver';
import { useDriverExpenses } from '../../hooks/useDriverExpenses';
import { dashboardService, getApiErrorMessage, unwrapApi } from '../../services/api';
import { computeExpenseTotals, parseAmountValue } from '../../utils/dateUtils';

const BRAND_DARK = '#02689B';
const BG_COLOR = '#F9FAFB';
const CARD_BG = '#FFFFFF';
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#6B7280';
const BORDER_COLOR = '#E5E7EB';

interface DashboardData {
  profile?: Record<string, unknown>;
  vehicle?: {
    registrationNumber?: string;
    make?: string;
    modelName?: string;
    ownerName?: string;
  };
  stats?: {
    todayExpenses?: number;
    monthExpenses?: number;
    lastServiceDate?: string | null;
    odometerLabel?: string | null;
  };
}

export const DashboardScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const reduxExpenses = useSelector((state: RootState) => state.expenses.expenses);
  const { refreshExpenses } = useDriverExpenses();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardService.getDashboard();
      const data = unwrapApi<DashboardData>(response);
      setDashboard(data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load dashboard'));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
      refreshExpenses();
    }, [loadDashboard, refreshExpenses]),
  );

  const profileUser = dashboard?.profile ?? authUser;
  const driver = mergeDriverProfile(profileUser);

  const stats = dashboard?.stats;
  const vehicle = dashboard?.vehicle;

  const apiToday = parseAmountValue(stats?.todayExpenses);
  const apiMonth = parseAmountValue(stats?.monthExpenses);
  const localTotals = computeExpenseTotals(reduxExpenses);
  const todayTotal = Math.max(apiToday, localTotals.today);
  const monthTotal = Math.max(apiMonth, localTotals.month);

  const driverData = {
    name: driver.name,
    vehicleNo: vehicle?.registrationNumber ?? driver.vehicleNo,
    vehicleModel:
      [vehicle?.make, vehicle?.modelName].filter(Boolean).join(' ').trim() ||
      driver.vehicleModel,
    owner: vehicle?.ownerName ?? driver.owner,
    lastService: stats?.lastServiceDate ?? '—',
    odometer: stats?.odometerLabel ?? '—',
    today: todayTotal.toLocaleString('en-IN'),
    month: monthTotal.toLocaleString('en-IN'),
  };

  if (loading && !dashboard) {
    return (
      <View style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading dashboard…</Text>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>{driver.initials}</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>FleetTrack</Text>
            <Text style={styles.headerSubtitle}>{driverData.name}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.bellBtn}
          activeOpacity={0.7}
          onPress={() => Alert.alert('Notifications', 'No new notifications')}
        >
          <Icon name="bell-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={loadDashboard}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#00A3E0', '#02689B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.vehicleCard}
        >
          <View style={styles.vehicleCardInner}>
            <View style={styles.vehicleDetails}>
              <Text style={styles.vehicleLabel}>PRIMARY VEHICLE</Text>
              <Text style={styles.vehicleNo}>{driverData.vehicleNo || 'Not assigned'}</Text>
              <Text style={styles.vehicleModel}>{driverData.vehicleModel || '—'}</Text>
              <Text style={styles.ownerText}>Owner: {driverData.owner}</Text>

              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>ACTIVE</Text>
                </View>
              </View>
            </View>

            <View style={styles.truckIconBox}>
              <Text style={styles.truckIcon}>🚚</Text>
            </View>
          </View>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Fleet Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Text style={styles.statIcon}>💵</Text>
            </View>
            <Text style={styles.statLabel}>Today's Expenses</Text>
            <Text style={styles.statValueBlue}>₹{driverData.today}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Text style={styles.statIcon}>💳</Text>
            </View>
            <Text style={styles.statLabel}>Month Total</Text>
            <Text style={styles.statValueBlue}>₹{driverData.month}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Text style={styles.statIcon}>🔧</Text>
            </View>
            <Text style={styles.statLabel}>Last Service</Text>
            <Text style={styles.statValueBlack}>{driverData.lastService}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Text style={styles.statIcon}>⏱️</Text>
            </View>
            <Text style={styles.statLabel}>Odometer</Text>
            <Text style={styles.statValueBlack}>{driverData.odometer}</Text>
          </View>
        </View>

        <View style={styles.dutySection}>
          <View style={styles.dutyHeader}>
            <Text style={styles.dutyTitle}>QUICK ACTIONS</Text>
            <View style={styles.blueDot} />
          </View>

          <TouchableOpacity
            style={styles.dutyCard}
            onPress={() => navigation.navigate('AddExpenseTab')}
          >
            <View style={styles.dutyCardInner}>
              <Text style={styles.dutyIcon}>⛽</Text>
              <View style={styles.dutyDetails}>
                <Text style={styles.dutyMainText}>Add Expense</Text>
                <Text style={styles.dutySubText}>Fuel, toll, repair, daily report</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BRAND_DARK },
  centered: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#E0F2FE', marginTop: 12, fontSize: 14 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: BRAND_DARK,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  avatarInitials: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { color: '#E0F2FE', fontSize: 13 },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorBanner: {
    backgroundColor: '#FEE2E2',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: { color: '#B91C1C', flex: 1, fontSize: 13, marginRight: 8 },
  retryText: { color: BRAND_DARK, fontWeight: '700', fontSize: 13 },

  content: { backgroundColor: BG_COLOR, flexGrow: 1, padding: 16, paddingBottom: 40 },

  vehicleCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  vehicleCardInner: { flexDirection: 'row', justifyContent: 'space-between' },
  vehicleDetails: { flex: 1, marginRight: 16 },
  vehicleLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  vehicleNo: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  vehicleModel: { color: '#FFF', fontSize: 16, fontWeight: '600', marginBottom: 2 },
  ownerText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 16 },
  badgeRow: { flexDirection: 'row' },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

  truckIconBox: {
    width: 80,
    height: 80,
    backgroundColor: '#1DA1F2',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  truckIcon: { fontSize: 40, color: '#FFF' },

  sectionTitle: { fontSize: 15, color: TEXT_DARK, fontWeight: '500', marginBottom: 12 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: CARD_BG,
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: { fontSize: 18 },
  statLabel: { fontSize: 12, color: TEXT_MUTED, fontWeight: '500', marginBottom: 4 },
  statValueBlue: { fontSize: 22, color: BRAND_DARK, fontWeight: 'bold' },
  statValueBlack: { fontSize: 16, color: TEXT_DARK, fontWeight: 'bold', marginTop: 2 },

  dutySection: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 16,
  },
  dutyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dutyTitle: { fontSize: 13, fontWeight: 'bold', color: TEXT_DARK, letterSpacing: 0.5 },
  blueDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: BRAND_DARK },
  dutyCard: {
    backgroundColor: CARD_BG,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  dutyCardInner: { flexDirection: 'row', alignItems: 'center' },
  dutyIcon: { fontSize: 24, marginRight: 16 },
  dutyDetails: { flex: 1 },
  dutyMainText: { fontSize: 14, fontWeight: 'bold', color: TEXT_DARK, marginBottom: 2 },
  dutySubText: { fontSize: 12, color: TEXT_MUTED },
  chevron: { fontSize: 20, color: TEXT_MUTED },
});
