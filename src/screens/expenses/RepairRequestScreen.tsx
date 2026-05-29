import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Text, Alert, TextInput } from 'react-native';
import { useDispatch } from 'react-redux';
import { addExpense } from '../../redux/slices/expenseSlice';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { colors } from '../../utils/colors';
import { getLocalIsoDate } from '../../utils/dateUtils';

export const RepairRequestScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please provide title and description');
      return;
    }

    dispatch(addExpense({
      id: Date.now().toString(),
      title: title,
      date: getLocalIsoDate(),
      amount: '0', // Pending estimate
      vehicle: 'HR26AB1234',
      icon: '🔧',
      iconBg: '#F3F4F6'
    }));

    Alert.alert('Success', 'Repair request submitted to owner', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <CustomInput label="Problem Title *" value={title} onChangeText={setTitle} placeholder="e.g. Engine Noise, Flat Tyre" />
          
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the issue in detail..."
            placeholderTextColor={colors.textLight}
          />
          
          <TouchableOpacity style={styles.uploadBtn}>
            <Text style={styles.uploadText}>+ Upload Issue Image</Text>
          </TouchableOpacity>

          <CustomButton title="Submit Request" onPress={handleSubmit} style={styles.submitBtn} />
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
    marginBottom: 16,
  },
  uploadBtn: { borderStyle: 'dashed', borderWidth: 1, borderColor: colors.primary, padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 24, backgroundColor: 'rgba(37, 99, 235, 0.05)' },
  uploadText: { color: colors.primary, fontWeight: '600' },
  submitBtn: { marginTop: 8 },
});
