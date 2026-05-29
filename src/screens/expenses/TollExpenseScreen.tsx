import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Text, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { addExpense } from '../../redux/slices/expenseSlice';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { colors } from '../../utils/colors';
import { getLocalIsoDate } from '../../utils/dateUtils';

export const TollExpenseScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [tollName, setTollName] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState('FASTag');
  const [tripPurpose, setTripPurpose] = useState('');

  const handleSubmit = () => {
    if (!tollName || !amount) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }

    dispatch(addExpense({
      id: Date.now().toString(),
      title: `${tollName} (Toll)`,
      date: getLocalIsoDate(),
      amount: amount,
      vehicle: 'HR26AB1234',
      icon: '🛣️',
      iconBg: '#F3F4F6'
    }));

    Alert.alert('Success', 'Toll expense added', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <CustomInput label="Toll Plaza Name *" value={tollName} onChangeText={setTollName} />
          <CustomInput label="Amount (₹) *" value={amount} onChangeText={setAmount} keyboardType="numeric" />
          
          <Text style={styles.label}>Payment Type</Text>
          <View style={styles.row}>
            {['FASTag', 'Cash', 'Card'].map(type => (
              <TouchableOpacity
                key={type}
                style={[styles.typeBtn, paymentType === type && styles.typeBtnActive]}
                onPress={() => setPaymentType(type)}
              >
                <Text style={[styles.typeText, paymentType === type && styles.typeTextActive]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <CustomInput label="Trip Purpose (Optional)" value={tripPurpose} onChangeText={setTripPurpose} />
          
          <TouchableOpacity style={styles.uploadBtn}>
            <Text style={styles.uploadText}>+ Upload Receipt</Text>
          </TouchableOpacity>

          <CustomButton title="Save Toll Expense" onPress={handleSubmit} style={styles.submitBtn} />
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
  row: { flexDirection: 'row', marginBottom: 16 },
  typeBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.border, marginRight: 12 },
  typeBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  typeText: { color: colors.text, fontWeight: '500' },
  typeTextActive: { color: colors.white },
  uploadBtn: { borderStyle: 'dashed', borderWidth: 1, borderColor: colors.primary, padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 24, backgroundColor: 'rgba(37, 99, 235, 0.05)' },
  uploadText: { color: colors.primary, fontWeight: '600' },
  submitBtn: { marginTop: 8 },
});
