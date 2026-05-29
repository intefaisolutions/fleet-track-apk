import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../utils/colors';

const BRAND_DARK = '#02689B';
const BRAND_LIGHT = '#00A3E0';
const BG_COLOR = '#F5F6F8';
const CARD_BG = '#FFFFFF';
const TEXT_DARK = '#1F2937';
const TEXT_MUTED = '#6B7280';
const BORDER_COLOR = '#E5E7EB';
const ICON_BG = '#F3F4F6';

export const DriverProfileScreen = () => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => dispatch(logout()) }
    ]);
  };

  return (
    <View style={styles.safeArea}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.smallAvatar}>
            <Text style={styles.smallAvatarText}>SY</Text>
          </View>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>
        <TouchableOpacity style={styles.headerRight}>
          <Text style={styles.bellIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.largeAvatarContainer}>
            <View style={styles.largeAvatar}>
              <Text style={styles.largeAvatarText}>SY</Text>
            </View>
          </View>
          <Text style={styles.name}>Suresh Yadav</Text>
          <Text style={styles.designation}>Fleet Driver #FT-9921</Text>
          
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnIcon}>✏️</Text>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Info Cards */}
        <View style={styles.cardsContainer}>
          {/* Phone */}
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <View style={styles.iconBox}>
                <Text style={styles.iconText}>📞</Text>
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardLabel}>Phone Number</Text>
                <Text style={styles.cardValue}>+91 98765 43210</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.actionIcon}>✏️</Text>
            </TouchableOpacity>
          </View>

          {/* Email */}
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <View style={styles.iconBox}>
                <Text style={styles.iconText}>✉️</Text>
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardLabel}>Email Address</Text>
                <Text style={styles.cardValue}>suresh.yadav@fleettrack.com</Text>
              </View>
            </View>
            <View>
              <Text style={styles.actionIcon}>🔒</Text>
            </View>
          </View>

          {/* Change Password */}
          <TouchableOpacity style={styles.card} onPress={() => Alert.alert('Coming Soon', 'Change Password feature')}>
            <View style={styles.cardLeft}>
              <View style={styles.iconBox}>
                <Text style={styles.iconText}>🔐</Text>
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={[styles.cardValue, { marginTop: 0 }]}>Change Password</Text>
              </View>
            </View>
            <View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Current Vehicle */}
        <View style={styles.vehicleSection}>
          <Text style={styles.sectionTitle}>Current Vehicle</Text>
          
          <View style={styles.vehicleCard}>
            <View style={styles.vehicleCardInner}>
              {/* Left Blue Box */}
              <View style={styles.vehicleIconBox}>
                <Text style={styles.vehicleIcon}>🚚</Text>
              </View>
              
              {/* Right Content */}
              <View style={styles.vehicleContent}>
                <View style={styles.vehicleHeader}>
                  <Text style={styles.vehicleName}>Tata Ace</Text>
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>ACTIVE</Text>
                  </View>
                </View>
                <Text style={styles.vehicleNumber}>HR 26 AB 1234</Text>
                
                <View style={styles.divider} />
                
                <View style={styles.ownerInfo}>
                  <Text style={styles.ownerLabel}>REGISTERED OWNER</Text>
                  <Text style={styles.ownerValue}>Rajesh     +91 99987...</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        {/* Logout Button (Optional but good to keep) */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BRAND_DARK },
  header: { 
    backgroundColor: BRAND_DARK, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  smallAvatar: { 
    width: 32, height: 32, borderRadius: 16, 
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center', alignItems: 'center', marginRight: 12
  },
  smallAvatarText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  headerRight: {},
  bellIcon: { fontSize: 20, color: '#FFF' },
  
  content: { backgroundColor: BG_COLOR, flexGrow: 1, paddingBottom: 40 },
  
  profileSection: {
    backgroundColor: CARD_BG,
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  largeAvatarContainer: {
    width: 104, height: 104, borderRadius: 52,
    backgroundColor: '#FFF',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
    marginBottom: 16,
  },
  largeAvatar: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: BRAND_DARK,
    justifyContent: 'center', alignItems: 'center',
  },
  largeAvatarText: { color: '#FFF', fontSize: 36, fontWeight: 'bold' },
  name: { fontSize: 24, fontWeight: 'bold', color: TEXT_DARK, marginBottom: 4 },
  designation: { fontSize: 14, color: TEXT_MUTED, marginBottom: 16 },
  editBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: BRAND_LIGHT,
    paddingHorizontal: 24, paddingVertical: 8,
    borderRadius: 20,
  },
  editBtnIcon: { fontSize: 14, marginRight: 6 },
  editBtnText: { color: '#FFF', fontWeight: '600', fontSize: 14 },

  cardsContainer: { padding: 16, paddingTop: 24 },
  card: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: CARD_BG,
    borderRadius: 12, padding: 16,
    marginBottom: 12,
    borderWidth: 1, borderColor: BORDER_COLOR,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: {
    width: 48, height: 48, borderRadius: 10,
    backgroundColor: ICON_BG,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 16,
  },
  iconText: { fontSize: 20 },
  cardTextContainer: { flex: 1, justifyContent: 'center' },
  cardLabel: { fontSize: 12, color: TEXT_MUTED, fontWeight: '500', marginBottom: 2 },
  cardValue: { fontSize: 15, color: TEXT_DARK, fontWeight: '500' },
  actionIcon: { fontSize: 16, color: TEXT_MUTED },
  chevron: { fontSize: 24, color: TEXT_MUTED, fontWeight: '300' },

  vehicleSection: { paddingHorizontal: 16, marginTop: 8 },
  sectionTitle: { fontSize: 14, color: TEXT_DARK, fontWeight: '500', marginBottom: 12 },
  vehicleCard: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    borderWidth: 1, borderColor: BORDER_COLOR,
    overflow: 'hidden',
    borderLeftWidth: 4, borderLeftColor: BRAND_LIGHT,
  },
  vehicleCardInner: { flexDirection: 'row', padding: 16 },
  vehicleIconBox: {
    width: 64, height: 64, backgroundColor: BRAND_LIGHT,
    justifyContent: 'center', alignItems: 'center', borderRadius: 8,
    marginRight: 16,
  },
  vehicleIcon: { fontSize: 32 },
  vehicleContent: { flex: 1 },
  vehicleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  vehicleName: { fontSize: 16, fontWeight: 'bold', color: TEXT_DARK },
  activeBadge: { 
    borderWidth: 1, borderColor: '#10B981', 
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4,
  },
  activeBadgeText: { fontSize: 10, color: '#10B981', fontWeight: 'bold' },
  vehicleNumber: { fontSize: 14, fontWeight: 'bold', color: BRAND_DARK, marginBottom: 12 },
  divider: { height: 1, backgroundColor: BORDER_COLOR, marginBottom: 12 },
  ownerInfo: {},
  ownerLabel: { fontSize: 10, color: TEXT_MUTED, marginBottom: 2 },
  ownerValue: { fontSize: 13, color: TEXT_DARK, fontWeight: '500' },

  logoutBtn: { margin: 16, marginTop: 32, padding: 16, alignItems: 'center', backgroundColor: '#FEE2E2', borderRadius: 12 },
  logoutBtnText: { color: '#EF4444', fontWeight: 'bold', fontSize: 16 },
});
