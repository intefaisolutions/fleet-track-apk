import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colors } from '../../utils/colors';

export const AddExpenseMainScreen = ({ navigation }: any) => {
  const categories = [
    { id: 1, title: 'Fuel Expense', icon: '⛽', route: 'FuelExpense', desc: 'Add fuel slip and details' },
    { id: 2, title: 'Toll Expense', icon: '🛣️', route: 'TollExpense', desc: 'Add toll tax details' },
    { id: 3, title: 'Repair Request', icon: '🔧', route: 'RepairRequest', desc: 'Report vehicle issues' },
    { id: 4, title: 'Daily Report', icon: '📝', route: 'DailyReport', desc: 'End of day km logging' },
    { id: 5, title: 'Service Alert', icon: '⚠️', route: 'ServiceAlert', desc: 'Upcoming service reminder' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Expense / Report</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Select Category</Text>
        
        {categories.map((cat) => (
          <TouchableOpacity 
            key={cat.id} 
            style={styles.card}
            onPress={() => cat.route !== 'ServiceAlert' ? navigation.navigate(cat.route) : null}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{cat.icon}</Text>
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{cat.title}</Text>
              <Text style={styles.cardDesc}>{cat.desc}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  content: { padding: 16 },
  subtitle: { fontSize: 16, color: colors.textLight, marginBottom: 16, fontWeight: '500' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: { fontSize: 24 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  cardDesc: { fontSize: 13, color: colors.textLight },
  arrow: { fontSize: 24, color: colors.textLight, marginLeft: 8 },
});
