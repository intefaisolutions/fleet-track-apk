import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { logout } from '../../redux/slices/authSlice';
import { mergeDriverProfile } from '../../constants/driver';
import { RootState } from '../../redux/store';

const BRAND_DARK = '#02689B';
const BRAND_LIGHT = '#00A3E0';
const BG_COLOR = '#F5F6F8';
const CARD_BG = '#FFFFFF';
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#6B7280';
const BORDER_COLOR = '#E5E7EB';
const ICON_BG = '#F3F4F6';

export const DriverProfileScreen = () => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const driver = mergeDriverProfile(authUser);

  const hasVehicle = Boolean(driver.vehicleModel && driver.vehicleNo);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => dispatch(logout()) },
    ]);
  };

  const showContactAdminAlert = (field: 'phone' | 'email') => {
    Alert.alert(
      'Contact Admin',
      `To update your ${field === 'phone' ? 'phone number' : 'email address'}, please contact your fleet admin or company owner.`,
      [{ text: 'OK' }],
    );
  };

  return (
    <View style={styles.safeArea}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerSide}>
          <View style={styles.smallAvatar}>
            <Text style={styles.smallAvatarText}>{driver.initials}</Text>
          </View>
        </View>

        <Text style={styles.headerTitle}>My Profile</Text>

        <View style={[styles.headerSide, styles.headerSideRight]}>
          <TouchableOpacity
            style={styles.bellBtn}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Notifications', 'No new notifications')}
          >
            <Icon name="bell-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.largeAvatarRing}>
            <View style={styles.largeAvatar}>
              <Text style={styles.largeAvatarText}>{driver.initials}</Text>
            </View>
          </View>
          <Text style={styles.name}>{driver.name}</Text>
          <Text style={styles.designation}>{driver.designation}</Text>
        </View>

        <View style={styles.cardsContainer}>
          <Text style={styles.contactHint}>
            Phone and email can only be updated by your fleet admin.
          </Text>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => showContactAdminAlert('phone')}
          >
            <View style={styles.cardLeft}>
              <View style={styles.iconBox}>
                <Icon name="phone-outline" size={22} color={BRAND_LIGHT} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardLabel}>Phone Number</Text>
                <Text style={styles.cardValue}>{driver.phone}</Text>
              </View>
            </View>
            <Icon name="lock-outline" size={18} color={TEXT_MUTED} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => showContactAdminAlert('email')}
          >
            <View style={styles.cardLeft}>
              <View style={styles.iconBox}>
                <Icon name="email-outline" size={22} color={BRAND_LIGHT} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardLabel}>Email Address</Text>
                <Text style={styles.cardValue} numberOfLines={1}>
                  {driver.email}
                </Text>
              </View>
            </View>
            <Icon name="lock-outline" size={18} color={TEXT_MUTED} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() =>
              Alert.alert(
                'Change Password',
                'Please contact your fleet admin to reset your password.',
                [{ text: 'OK' }],
              )
            }
          >
            <View style={styles.cardLeft}>
              <View style={styles.iconBox}>
                <Icon name="lock-reset" size={22} color={BRAND_LIGHT} />
              </View>
              <Text style={styles.cardActionTitle}>Change Password</Text>
            </View>
            <Icon name="chevron-right" size={22} color={TEXT_MUTED} />
          </TouchableOpacity>
        </View>

        <View style={styles.vehicleSection}>
          <Text style={styles.sectionTitle}>Current Vehicle</Text>

          {hasVehicle ? (
            <View style={styles.vehicleCard}>
              <View style={styles.vehicleCardInner}>
                <View style={styles.vehicleIconBox}>
                  <Icon name="truck-outline" size={28} color="#FFFFFF" />
                  <View style={styles.pinBadge}>
                    <Icon name="map-marker" size={10} color="#FFFFFF" />
                  </View>
                </View>

                <View style={styles.vehicleContent}>
                  <View style={styles.vehicleHeader}>
                    <Text style={styles.vehicleName} numberOfLines={1}>
                      {driver.vehicleModel}
                    </Text>
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>ACTIVE</Text>
                    </View>
                  </View>

                  <Text style={styles.vehicleNumber}>{driver.vehicleNo}</Text>

                  <View style={styles.divider} />

                  <Text style={styles.ownerLabel}>REGISTERED OWNER</Text>
                  <Text style={styles.ownerValue} numberOfLines={2}>
                    {driver.owner}
                  </Text>
                  <Text style={styles.ownerPhone}>{driver.ownerPhone}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.emptyVehicleCard}>
              <Icon name="truck-off-outline" size={36} color={TEXT_MUTED} />
              <Text style={styles.emptyVehicleTitle}>No vehicle assigned</Text>
              <Text style={styles.emptyVehicleText}>
                Contact your fleet owner to assign a vehicle.
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Icon name="logout" size={18} color="#EF4444" />
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
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerSide: { width: 44, alignItems: 'flex-start' },
  headerSideRight: { alignItems: 'flex-end' },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  smallAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallAvatarText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: { backgroundColor: BG_COLOR, flexGrow: 1, paddingBottom: 32 },

  profileSection: {
    backgroundColor: CARD_BG,
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  largeAvatarRing: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 14,
  },
  largeAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: BRAND_DARK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeAvatarText: { color: '#FFF', fontSize: 34, fontWeight: '700' },
  name: { fontSize: 22, fontWeight: '700', color: TEXT_DARK, marginBottom: 4 },
  designation: { fontSize: 13, color: TEXT_MUTED },

  cardsContainer: { paddingHorizontal: 16, paddingTop: 20 },
  contactHint: {
    fontSize: 12,
    color: TEXT_MUTED,
    lineHeight: 18,
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: CARD_BG,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    elevation: 1,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: ICON_BG,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardTextContainer: { flex: 1 },
  cardLabel: {
    fontSize: 11,
    color: TEXT_MUTED,
    fontWeight: '500',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  cardValue: { fontSize: 14, color: TEXT_DARK, fontWeight: '500' },
  cardActionTitle: { fontSize: 15, color: TEXT_DARK, fontWeight: '600' },

  vehicleSection: { paddingHorizontal: 16, marginTop: 10, marginBottom: 8 },
  sectionTitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    fontWeight: '500',
    marginBottom: 10,
  },
  vehicleCard: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderLeftWidth: 4,
    borderLeftColor: BRAND_LIGHT,
    elevation: 2,
  },
  vehicleCardInner: {
    flexDirection: 'row',
    padding: 14,
    alignItems: 'flex-start',
  },
  vehicleIconBox: {
    width: 56,
    height: 56,
    backgroundColor: BRAND_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 12,
  },
  pinBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: BRAND_DARK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleContent: {
    flex: 1,
    minWidth: 0,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: 8,
  },
  vehicleName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  activeBadge: {
    borderWidth: 1,
    borderColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#ECFDF5',
  },
  activeBadgeText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  vehicleNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: BRAND_DARK,
    marginBottom: 10,
  },
  divider: { height: 1, backgroundColor: BORDER_COLOR, marginBottom: 10 },
  ownerLabel: {
    fontSize: 10,
    color: TEXT_MUTED,
    marginBottom: 4,
    letterSpacing: 0.4,
    fontWeight: '500',
  },
  ownerValue: { fontSize: 14, color: TEXT_DARK, fontWeight: '600', marginBottom: 2 },
  ownerPhone: { fontSize: 13, color: TEXT_MUTED, fontWeight: '500' },

  emptyVehicleCard: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 24,
    alignItems: 'center',
  },
  emptyVehicleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_DARK,
    marginTop: 10,
    marginBottom: 4,
  },
  emptyVehicleText: {
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 18,
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 20,
    padding: 14,
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
  },
  logoutBtnText: { color: '#EF4444', fontWeight: '600', fontSize: 15 },
});
