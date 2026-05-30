import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Text, Alert, TextInput } from 'react-native';
import { useDispatch } from 'react-redux';
import { addExpense } from '../../redux/slices/expenseSlice';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { colors } from '../../utils/colors';
import { getLocalIsoDate } from '../../utils/dateUtils';

export const DailyReportScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [totalKm, setTotalKm] = useState('');
  const [destination, setDestination] = useState('');
  const [dayExpense, setDayExpense] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!totalKm || !destination || !dayExpense) {
      Alert.alert('Error', 'Please fill total KM, destination and day expense');
      return;
    }

    const expenseAmount = parseFloat(dayExpense.replace(/,/g, ''));
    if (Number.isNaN(expenseAmount) || expenseAmount < 0) {
      Alert.alert('Error', 'Please enter a valid expense amount');
      return;
    }
    
    dispatch(addExpense({
      id: Date.now().toString(),
      title: `Daily Report: ${destination} (${totalKm} km)`,
      date: getLocalIsoDate(),
      amount: expenseAmount.toFixed(2),
      vehicle: 'HR26AB1234',
      icon: '📝',
      iconBg: '#F3F4F6'
    }));

    Alert.alert('Success', 'Daily report submitted', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <CustomInput label="Total KM Travelled Today *" value={totalKm} onChangeText={setTotalKm} keyboardType="numeric" />
          <CustomInput label="Main Destination(s) *" value={destination} onChangeText={setDestination} />
          <CustomInput
            label="Total Expense Today (₹) *"
            value={dayExpense}
            onChangeText={setDayExpense}
            keyboardType="numeric"
            placeholder="e.g. 4,500"
          />
          
          <Text style={styles.label}>Additional Notes</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            placeholder="Any incidents or notes for the day..."
            placeholderTextColor={colors.textLight}
          />
          
          <CustomButton title="Submit Report" onPress={handleSubmit} style={styles.submitBtn} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  card: { backgroundColor: colors.white, padding: 16, borderRadius: 12, elevation: 2 },
  label: { fontSize: 14, color: colors.text, marginBottom: 8, fontWeight: '500' },
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  submitBtn: { marginTop: 8 },
});
