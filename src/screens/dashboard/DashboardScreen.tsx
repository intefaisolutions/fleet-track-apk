import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const BRAND_DARK = '#02689B';
const BRAND_LIGHT = '#00A3E0';
const BG_COLOR = '#F9FAFB';
const CARD_BG = '#FFFFFF';
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#6B7280';
const BORDER_COLOR = '#E5E7EB';

export const DashboardScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const expenses = useSelector((state: RootState) => state.expenses.expenses);

  const calculateStats = () => {
    let todayTotal = 0;
    let monthTotal = 0;
    
    // Convert to IST offset loosely or just use local system date format YYYY-MM-DD
    const today = new Date();
    // Offset for standard timezone issues, best to just use local
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    const monthStr = `${yyyy}-${mm}`;

    expenses.forEach(e => {
      const amt = parseFloat((e.amount || '0').replace(/,/g, ''));
      if (e.date === todayStr) {
        todayTotal += amt;
      }
      if (e.date.startsWith(monthStr)) {
        monthTotal += amt;
      }
    });

    return {
      today: todayTotal.toLocaleString(),
      month: monthTotal.toLocaleString()
    };
  };

  const stats = calculateStats();

  const driverData = {
    name: 'Suresh Yadav',
    vehicleNo: 'HR 26 AB 1234',
    vehicleModel: 'Tata Ace',
    owner: 'Rajesh Sharma',
    lastService: '12 Oct 2023',
    odometer: '45,230 km'
  };

  return (
    <View style={styles.safeArea}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Image 
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} // Dummy avatar image
              style={styles.avatarImage} 
            />
          </View>
          <View>
            <Text style={styles.headerTitle}>FleetTrack</Text>
            <Text style={styles.headerSubtitle}>{driverData.name}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Text style={styles.bellIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Primary Vehicle Card */}
        <LinearGradient 
          colors={['#00A3E0', '#02689B']} 
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.vehicleCard}
        >
          <View style={styles.vehicleCardInner}>
            <View style={styles.vehicleDetails}>
              <Text style={styles.vehicleLabel}>PRIMARY VEHICLE</Text>
              <Text style={styles.vehicleNo}>{driverData.vehicleNo}</Text>
              <Text style={styles.vehicleModel}>{driverData.vehicleModel}</Text>
              <Text style={styles.ownerText}>Owner: {driverData.owner}</Text>
              
              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>ACTIVE</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>VERIFIED</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.truckIconBox}>
              <Text style={styles.truckIcon}>🚚</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Fleet Statistics */}
        <Text style={styles.sectionTitle}>Fleet Statistics</Text>
        <View style={styles.statsGrid}>
          {/* Today's Expenses */}
          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Text style={styles.statIcon}>💵</Text>
            </View>
            <Text style={styles.statLabel}>Today's Expenses</Text>
            <Text style={styles.statValueBlue}>₹{stats.today}</Text>
          </View>

          {/* Month Total */}
          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Text style={styles.statIcon}>💳</Text>
            </View>
            <Text style={styles.statLabel}>Month Total</Text>
            <Text style={styles.statValueBlue}>₹{stats.month}</Text>
          </View>

          {/* Last Service */}
          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Text style={styles.statIcon}>🔧</Text>
            </View>
            <Text style={styles.statLabel}>Last Service</Text>
            <Text style={styles.statValueBlack}>{driverData.lastService}</Text>
          </View>

          {/* Odometer */}
          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Text style={styles.statIcon}>⏱️</Text>
            </View>
            <Text style={styles.statLabel}>Odometer</Text>
            <Text style={styles.statValueBlack}>{driverData.odometer}</Text>
          </View>
        </View>

        {/* Duty Updates */}
        <View style={styles.dutySection}>
          <View style={styles.dutyHeader}>
            <Text style={styles.dutyTitle}>DUTY UPDATES</Text>
            <View style={styles.blueDot} />
          </View>
          
          <TouchableOpacity 
            style={styles.dutyCard}
            onPress={() => navigation.navigate('FuelExpense')}
          >
            <View style={styles.dutyCardInner}>
              <Text style={styles.dutyIcon}>⛽</Text>
              <View style={styles.dutyDetails}>
                <Text style={styles.dutyMainText}>Fuel Refill Required</Text>
                <Text style={styles.dutySubText}>Recommended at Station #42</Text>
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
  
  // Header
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
    width: 40, height: 40, borderRadius: 20, 
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
    marginRight: 12, overflow: 'hidden'
  },
  avatarImage: { width: '100%', height: '100%' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { color: '#E0F2FE', fontSize: 13 },
  bellIcon: { fontSize: 20, color: '#FFF' },
  
  // Content
  content: { backgroundColor: BG_COLOR, flexGrow: 1, padding: 16, paddingBottom: 40 },
  
  // Vehicle Card
  vehicleCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  vehicleCardInner: { flexDirection: 'row', justifyContent: 'space-between' },
  vehicleDetails: { flex: 1, marginRight: 16 },
  vehicleLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 'bold', letterSpacing: 1, marginBottom: 8 },
  vehicleNo: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  vehicleModel: { color: '#FFF', fontSize: 16, fontWeight: '600', marginBottom: 2 },
  ownerText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 16 },
  badgeRow: { flexDirection: 'row' },
  badge: { 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    paddingHorizontal: 12, paddingVertical: 4, 
    borderRadius: 12, marginRight: 8 
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  
  truckIconBox: { 
    width: 80, height: 80, 
    backgroundColor: '#1DA1F2', 
    borderRadius: 12, 
    justifyContent: 'center', alignItems: 'center' 
  },
  truckIcon: { fontSize: 40, color: '#FFF' },

  // Stats Grid
  sectionTitle: { fontSize: 15, color: TEXT_DARK, fontWeight: '500', marginBottom: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  statCard: {
    backgroundColor: CARD_BG,
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1, borderColor: BORDER_COLOR,
  },
  statIconBox: {
    width: 36, height: 36, borderRadius: 8,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: { fontSize: 18 },
  statLabel: { fontSize: 12, color: TEXT_MUTED, fontWeight: '500', marginBottom: 4 },
  statValueBlue: { fontSize: 22, color: BRAND_DARK, fontWeight: 'bold' },
  statValueBlack: { fontSize: 16, color: TEXT_DARK, fontWeight: 'bold', marginTop: 2 },

  // Duty Updates
  dutySection: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderWidth: 1, borderColor: BORDER_COLOR,
    padding: 16,
  },
  dutyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  dutyTitle: { fontSize: 13, fontWeight: 'bold', color: TEXT_DARK, letterSpacing: 0.5 },
  blueDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: BRAND_DARK },
  dutyCard: {
    backgroundColor: CARD_BG,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1, borderColor: BORDER_COLOR,
  },
  dutyCardInner: { flexDirection: 'row', alignItems: 'center' },
  dutyIcon: { fontSize: 24, marginRight: 16 },
  dutyDetails: { flex: 1 },
  dutyMainText: { fontSize: 14, fontWeight: 'bold', color: TEXT_DARK, marginBottom: 2 },
  dutySubText: { fontSize: 12, color: TEXT_MUTED },
  chevron: { fontSize: 20, color: TEXT_MUTED },
});
