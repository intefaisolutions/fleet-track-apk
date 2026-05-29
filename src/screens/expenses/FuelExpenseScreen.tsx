import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Text, TouchableOpacity, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { addExpense } from '../../redux/slices/expenseSlice';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { colors } from '../../utils/colors';
import { getLocalIsoDate } from '../../utils/dateUtils';

export const FuelExpenseScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [date, setDate] = useState(getLocalIsoDate());
  const [odometer, setOdometer] = useState('');
  const [litres, setLitres] = useState('');
  const [pricePerLitre, setPricePerLitre] = useState('');
  const [total, setTotal] = useState('0');
  const [station, setStation] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  useEffect(() => {
    if (litres && pricePerLitre) {
      const l = parseFloat(litres);
      const p = parseFloat(pricePerLitre);
      if (!isNaN(l) && !isNaN(p)) {
        setTotal((l * p).toFixed(2));
      }
    } else {
      setTotal('0');
    }
  }, [litres, pricePerLitre]);

  const handleSubmit = () => {
    if (!odometer || !litres || !pricePerLitre || !station) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    dispatch(addExpense({
      id: Date.now().toString(),
      title: `${station} (Fuel)`,
      date: date,
      amount: total,
      vehicle: 'HR26AB1234',
      icon: '⛽',
      iconBg: '#E0F2FE'
    }));

    Alert.alert('Success', 'Fuel expense added successfully', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <CustomInput label="Date" value={date} onChangeText={setDate} />
          <CustomInput label="Current Odometer (KM)" value={odometer} onChangeText={setOdometer} keyboardType="numeric" />
          <View style={styles.row}>
            <View style={styles.half}>
              <CustomInput label="Litres" value={litres} onChangeText={setLitres} keyboardType="numeric" />
            </View>
            <View style={styles.half}>
              <CustomInput label="Price/Litre" value={pricePerLitre} onChangeText={setPricePerLitre} keyboardType="numeric" />
            </View>
          </View>
          
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Auto Total Amount</Text>
            <Text style={styles.totalValue}>₹{total}</Text>
          </View>

          <CustomInput label="Fuel Station Name" value={station} onChangeText={setStation} />
          
          <Text style={styles.label}>Payment Method</Text>
          <View style={styles.paymentRow}>
            {['Cash', 'Card', 'UPI', 'Fuel Card'].map(method => (
              <TouchableOpacity
                key={method}
                style={[styles.paymentBtn, paymentMethod === method && styles.paymentBtnActive]}
                onPress={() => setPaymentMethod(method)}
              >
                <Text style={[styles.paymentText, paymentMethod === method && styles.paymentTextActive]}>{method}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.uploadBtn}>
            <Text style={styles.uploadText}>+ Upload Receipt Image</Text>
          </TouchableOpacity>

          <CustomButton title="Save Expense" onPress={handleSubmit} style={styles.submitBtn} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  card: { backgroundColor: colors.white, padding: 16, borderRadius: 12, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  half: { width: '48%' },
  totalBox: { backgroundColor: colors.background, padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  totalLabel: { fontSize: 14, color: colors.textLight, marginBottom: 4 },
  totalValue: { fontSize: 24, fontWeight: 'bold', color: colors.primary },
  label: { fontSize: 14, color: colors.text, marginBottom: 8, fontWeight: '500' },
  paymentRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  paymentBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginRight: 8, marginBottom: 8 },
  paymentBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  paymentText: { color: colors.text, fontSize: 14 },
  paymentTextActive: { color: colors.white },
  uploadBtn: { borderStyle: 'dashed', borderWidth: 1, borderColor: colors.primary, padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 24, backgroundColor: 'rgba(37, 99, 235, 0.05)' },
  uploadText: { color: colors.primary, fontWeight: '600' },
  submitBtn: { marginTop: 8 },
});
