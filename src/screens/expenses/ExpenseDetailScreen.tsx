import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import { colors } from '../../utils/colors';

export const ExpenseDetailScreen = ({ route }: any) => {
  const { expense } = route.params || { expense: { title: 'Unknown', amount: '0', date: '-' } };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: expense.iconBg || colors.background }]}>
              <Text style={styles.icon}>{expense.icon || '📝'}</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.type}>{expense.title || 'Expense'}</Text>
              <Text style={styles.date}>{expense.date}</Text>
            </View>
            {expense.status && (
              <Text style={[
                styles.status,
                expense.status === 'Approved' ? styles.statusApproved : 
                expense.status === 'Pending' ? styles.statusPending : styles.statusRejected
              ]}>{expense.status}</Text>
            )}
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Amount</Text>
            <Text style={styles.value}>₹{parseFloat((expense.amount || '0').replace(/,/g, '')).toLocaleString()}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Submitted On</Text>
            <Text style={styles.value}>{expense.date}</Text>
          </View>

          {expense.vehicle && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Vehicle Assigned</Text>
              <Text style={styles.value}>{expense.vehicle}</Text>
            </View>
          )}

          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Receipt Image</Text>
          <View style={styles.imageContainer}>
            <Text style={styles.imagePlaceholderText}>Receipt Image Not Available</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  card: { backgroundColor: colors.white, padding: 20, borderRadius: 12, elevation: 2 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  icon: { fontSize: 24 },
  headerText: { flex: 1 },
  type: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  date: { fontSize: 14, color: colors.textLight },
  status: { fontSize: 14, fontWeight: 'bold', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: colors.background, overflow: 'hidden' },
  statusApproved: { color: colors.success, backgroundColor: 'rgba(16, 185, 129, 0.1)' },
  statusPending: { color: colors.warning, backgroundColor: 'rgba(245, 158, 11, 0.1)' },
  statusRejected: { color: colors.error, backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { fontSize: 14, color: colors.textLight },
  value: { fontSize: 14, fontWeight: '600', color: colors.text },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 12 },
  imageContainer: { height: 200, backgroundColor: colors.background, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  imagePlaceholderText: { color: colors.textLight },
});
