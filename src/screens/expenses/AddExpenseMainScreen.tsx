import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  Pressable,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomInput } from '../../components/CustomInput';
import { ReceiptUploadButton } from '../../components/ReceiptUploadButton';
import { formatCurrency, formatDisplayDate, getLocalIsoDate } from '../../utils/dateUtils';
import {
  expenseService,
  getApiErrorMessage,
  unwrapApi,
} from '../../services/api';
import {
  buildDailyReportPayload,
  buildFuelExpensePayload,
  buildOtherExpensePayload,
  buildRepairRequestPayload,
  buildServiceExpensePayload,
  buildTollExpensePayload,
} from '../../utils/expensePayloads';
import { mapExpenseToUi } from '../../utils/expenseMapper';
import { addExpense } from '../../redux/slices/expenseSlice';

const MONO = {
  active: '#1DA1F2',
  brand: '#02689B',
  text: '#111827',
  muted: '#6B7280',
  border: '#E5E7EB',
  bg: '#F9FAFB',
  surface: '#FFFFFF',
  tint: '#E8F4FC',
};

type ExpenseCategory = 'fuel' | 'toll' | 'service' | 'repair' | 'daily' | 'other';

const CATEGORIES: { id: ExpenseCategory; label: string; icon: string }[] = [
  { id: 'fuel', label: 'Fuel', icon: 'gas-station' },
  { id: 'toll', label: 'Toll', icon: 'highway' },
  { id: 'service', label: 'Service', icon: 'wrench-outline' },
  { id: 'repair', label: 'Repair Req', icon: 'wrench' },
  { id: 'daily', label: 'Daily Report', icon: 'clipboard-text-outline' },
  { id: 'other', label: 'Other', icon: 'cash-multiple' },
];

const FUEL_PAYMENT_OPTIONS = ['Cash', 'Card', 'UPI', 'Fleet Card'];
const TOLL_PAYMENT_OPTIONS = ['FASTag', 'Cash', 'Card'];

export const AddExpenseMainScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ExpenseCategory>('fuel');
  const [paymentPickerVisible, setPaymentPickerVisible] = useState(false);
  const [paymentPickerTarget, setPaymentPickerTarget] = useState<'fuel' | 'toll'>('fuel');

  const [date, setDate] = useState(getLocalIsoDate());
  const [odometer, setOdometer] = useState('');
  const [litres, setLitres] = useState('');
  const [pricePerLitre, setPricePerLitre] = useState('');
  const [total, setTotal] = useState('0');
  const [station, setStation] = useState('');
  const [fuelPaymentMethod, setFuelPaymentMethod] = useState('Fleet Card');

  const [tollName, setTollName] = useState('');
  const [tollAmount, setTollAmount] = useState('');
  const [tollPaymentType, setTollPaymentType] = useState('FASTag');
  const [tripPurpose, setTripPurpose] = useState('');

  const [repairTitle, setRepairTitle] = useState('');
  const [repairDescription, setRepairDescription] = useState('');

  const [totalKm, setTotalKm] = useState('');
  const [destination, setDestination] = useState('');
  const [dailyExpense, setDailyExpense] = useState('');
  const [dailyNotes, setDailyNotes] = useState('');

  const [serviceDate, setServiceDate] = useState(getLocalIsoDate());
  const [serviceType, setServiceType] = useState('');
  const [serviceCenter, setServiceCenter] = useState('');
  const [serviceAmount, setServiceAmount] = useState('');
  const [serviceOdometer, setServiceOdometer] = useState('');
  const [serviceNotes, setServiceNotes] = useState('');

  const [otherCost, setOtherCost] = useState('');
  const [otherDescription, setOtherDescription] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

  useEffect(() => {
    setReceiptUrl('');
  }, [activeCategory]);

  useEffect(() => {
    if (litres && pricePerLitre) {
      const l = parseFloat(litres);
      const p = parseFloat(pricePerLitre);
      if (!Number.isNaN(l) && !Number.isNaN(p)) {
        setTotal((l * p).toFixed(2));
      }
    } else {
      setTotal('0');
    }
  }, [litres, pricePerLitre]);

  const openPaymentPicker = (target: 'fuel' | 'toll') => {
    setPaymentPickerTarget(target);
    setPaymentPickerVisible(true);
  };

  const handleFuelSubmit = async () => {
    if (!odometer || !litres || !pricePerLitre || !station) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = buildFuelExpensePayload({
        date,
        odometer,
        litres,
        pricePerLitre,
        total,
        station,
        paymentMethod: fuelPaymentMethod,
        receiptUrl: receiptUrl || undefined,
      });
      const response = await expenseService.addExpense(payload);
      const created = unwrapApi<Record<string, unknown>>(response);
      dispatch(addExpense(mapExpenseToUi(created)));
      Alert.alert('Success', 'Fuel expense added successfully');
      resetFuelForm();
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error, 'Failed to save fuel expense'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleTollSubmit = async () => {
    if (!tollName || !tollAmount) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = buildTollExpensePayload({
        tollName,
        amount: tollAmount,
        paymentType: tollPaymentType,
        tripPurpose,
        receiptUrl: receiptUrl || undefined,
      });
      const response = await expenseService.addExpense(payload);
      const created = unwrapApi<Record<string, unknown>>(response);
      dispatch(addExpense(mapExpenseToUi(created)));
      Alert.alert('Success', 'Toll expense added');
      resetTollForm();
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error, 'Failed to save toll expense'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRepairSubmit = async () => {
    if (!repairTitle || !repairDescription) {
      Alert.alert('Error', 'Please provide title and description');
      return;
    }

    setSubmitting(true);
    try {
      const payload = buildRepairRequestPayload({
        title: repairTitle,
        description: repairDescription,
        receiptUrl: receiptUrl || undefined,
      });
      const response = await expenseService.addRepairRequest(payload);
      const created = unwrapApi<Record<string, unknown>>(response);
      dispatch(addExpense(mapExpenseToUi(created)));
      Alert.alert('Success', 'Repair request submitted to owner');
      setRepairTitle('');
      setRepairDescription('');
      clearReceipt();
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error, 'Failed to submit repair request'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleServiceSubmit = async () => {
    if (!serviceType.trim() || !serviceCenter.trim() || !serviceAmount.trim()) {
      Alert.alert('Error', 'Please fill service type, center and amount');
      return;
    }

    const amount = parseFloat(serviceAmount.replace(/,/g, ''));
    if (Number.isNaN(amount) || amount < 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setSubmitting(true);
    try {
      const payload = buildServiceExpensePayload({
        date: serviceDate,
        serviceType,
        serviceCenter,
        amount: serviceAmount,
        odometer: serviceOdometer,
        notes: serviceNotes,
        receiptUrl: receiptUrl || undefined,
      });
      const response = await expenseService.addExpense(payload);
      const created = unwrapApi<Record<string, unknown>>(response);
      dispatch(addExpense(mapExpenseToUi(created)));
      Alert.alert('Success', 'Service record added successfully');
      setServiceType('');
      setServiceCenter('');
      setServiceAmount('');
      setServiceOdometer('');
      setServiceNotes('');
      clearReceipt();
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error, 'Failed to save service record'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtherSubmit = async () => {
    if (!otherCost.trim() || !otherDescription.trim()) {
      Alert.alert('Error', 'Please enter cost and description');
      return;
    }

    const amount = parseFloat(otherCost.replace(/,/g, ''));
    if (Number.isNaN(amount) || amount < 0) {
      Alert.alert('Error', 'Please enter a valid cost');
      return;
    }

    setSubmitting(true);
    try {
      const payload = buildOtherExpensePayload({
        cost: otherCost,
        description: otherDescription,
        receiptUrl: receiptUrl || undefined,
      });
      const response = await expenseService.addExpense(payload);
      const created = unwrapApi<Record<string, unknown>>(response);
      dispatch(addExpense(mapExpenseToUi(created)));
      Alert.alert('Success', 'Other expense added successfully');
      setOtherCost('');
      setOtherDescription('');
      clearReceipt();
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error, 'Failed to save other expense'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDailySubmit = async () => {
    if (!totalKm || !destination || !dailyExpense) {
      Alert.alert('Error', 'Please fill total KM, destination and day expense');
      return;
    }

    const expenseAmount = parseFloat(dailyExpense.replace(/,/g, ''));
    if (Number.isNaN(expenseAmount) || expenseAmount < 0) {
      Alert.alert('Error', 'Please enter a valid expense amount');
      return;
    }

    setSubmitting(true);
    try {
      const payload = buildDailyReportPayload({
        totalKm,
        destination,
        dailyExpense,
        notes: dailyNotes,
      });
      const response = await expenseService.addDailyReport(payload);
      const created = unwrapApi<Record<string, unknown>>(response);
      dispatch(addExpense(mapExpenseToUi(created)));
      Alert.alert('Success', 'Daily report submitted');
      setTotalKm('');
      setDestination('');
      setDailyExpense('');
      setDailyNotes('');
      clearReceipt();
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error, 'Failed to submit daily report'));
    } finally {
      setSubmitting(false);
    }
  };

  const resetFuelForm = () => {
    setOdometer('');
    setLitres('');
    setPricePerLitre('');
    setStation('');
    setTotal('0');
    setReceiptUrl('');
  };

  const resetTollForm = () => {
    setTollName('');
    setTollAmount('');
    setTripPurpose('');
    setReceiptUrl('');
  };

  const clearReceipt = () => setReceiptUrl('');

  const handleSave = () => {
    if (submitting) return;
    switch (activeCategory) {
      case 'fuel':
        handleFuelSubmit();
        break;
      case 'toll':
        handleTollSubmit();
        break;
      case 'repair':
        handleRepairSubmit();
        break;
      case 'daily':
        handleDailySubmit();
        break;
      case 'service':
        handleServiceSubmit();
        break;
      case 'other':
        handleOtherSubmit();
        break;
      default:
        break;
    }
  };

  const activeMeta = CATEGORIES.find((c) => c.id === activeCategory) ?? CATEGORIES[0];
  const paymentOptions = paymentPickerTarget === 'fuel' ? FUEL_PAYMENT_OPTIONS : TOLL_PAYMENT_OPTIONS;
  const selectedPayment =
    paymentPickerTarget === 'fuel' ? fuelPaymentMethod : tollPaymentType;

  const renderIllustration = () => (
    <View style={styles.illustrationCard}>
      <View style={styles.illustrationInner}>
        <Icon name={activeMeta.icon} size={48} color={MONO.active} />
        <View style={styles.illustrationAccent}>
          <Icon name="cellphone-check" size={24} color={MONO.muted} />
        </View>
      </View>
    </View>
  );

  const inputProps = {
    labelStyle: styles.fieldLabel,
    inputContainerStyle: styles.fieldInput,
    inputStyle: styles.fieldText,
    containerStyle: styles.fieldContainer,
  };

  const renderFuelForm = () => (
    <>
      <CustomInput
        label="Date"
        value={formatDisplayDate(date)}
        editable={false}
        {...inputProps}
        rightIcon={<Icon name="calendar-month-outline" size={18} color={MONO.muted} />}
      />
      <CustomInput
        label="Current Odometer (km)"
        value={odometer}
        onChangeText={setOdometer}
        keyboardType="numeric"
        placeholder="e.g. 45,230"
        {...inputProps}
      />
      <View style={styles.row}>
        <View style={styles.half}>
          <CustomInput
            label="Litres Filled"
            value={litres}
            onChangeText={setLitres}
            keyboardType="numeric"
            placeholder="35.0"
            {...inputProps}
            containerStyle={[styles.fieldContainer, styles.halfInput]}
          />
        </View>
        <View style={styles.half}>
          <CustomInput
            label="Price / Litre"
            value={pricePerLitre}
            onChangeText={setPricePerLitre}
            keyboardType="numeric"
            placeholder="100.00"
            {...inputProps}
            containerStyle={[styles.fieldContainer, styles.halfInput]}
          />
        </View>
      </View>

      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Estimated Total</Text>
        <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
      </View>

      <CustomInput
        label="Fuel Station"
        value={station}
        onChangeText={setStation}
        placeholder="Indian Oil - Sector 62"
        {...inputProps}
      />

      <Text style={styles.fieldLabel}>Payment Method</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => openPaymentPicker('fuel')}
        activeOpacity={0.8}
      >
        <Text style={styles.dropdownText}>{fuelPaymentMethod}</Text>
        <Icon name="chevron-down" size={18} color={MONO.muted} />
      </TouchableOpacity>
    </>
  );

  const renderTollForm = () => (
    <>
      <CustomInput
        label="Toll Plaza Name"
        value={tollName}
        onChangeText={setTollName}
        placeholder="e.g. Manesar Toll"
        {...inputProps}
      />
      <CustomInput
        label="Amount (₹)"
        value={tollAmount}
        onChangeText={setTollAmount}
        keyboardType="numeric"
        placeholder="e.g. 250"
        {...inputProps}
      />
      <Text style={styles.fieldLabel}>Payment Type</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => openPaymentPicker('toll')}
        activeOpacity={0.8}
      >
        <Text style={styles.dropdownText}>{tollPaymentType}</Text>
        <Icon name="chevron-down" size={18} color={MONO.muted} />
      </TouchableOpacity>
      <CustomInput
        label="Trip Purpose (Optional)"
        value={tripPurpose}
        onChangeText={setTripPurpose}
        placeholder="Delivery / Return trip"
        {...inputProps}
      />
    </>
  );

  const renderRepairForm = () => (
    <>
      <CustomInput
        label="Problem Title"
        value={repairTitle}
        onChangeText={setRepairTitle}
        placeholder="e.g. Engine Noise, Flat Tyre"
        {...inputProps}
      />
      <Text style={styles.fieldLabel}>Description</Text>
      <TextInput
        style={styles.textArea}
        multiline
        numberOfLines={4}
        value={repairDescription}
        onChangeText={setRepairDescription}
        placeholder="Describe the issue in detail..."
        placeholderTextColor={MONO.muted}
      />
    </>
  );

  const renderDailyForm = () => (
    <>
      <CustomInput
        label="Total KM Travelled Today"
        value={totalKm}
        onChangeText={setTotalKm}
        keyboardType="numeric"
        placeholder="e.g. 320"
        {...inputProps}
      />
      <CustomInput
        label="Main Destination(s)"
        value={destination}
        onChangeText={setDestination}
        placeholder="e.g. Delhi - Jaipur"
        {...inputProps}
      />
      <CustomInput
        label="Total Expense Today (₹)"
        value={dailyExpense}
        onChangeText={setDailyExpense}
        keyboardType="numeric"
        placeholder="e.g. 4,500"
        {...inputProps}
      />
      {dailyExpense ? (
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Day Expense</Text>
          <Text style={styles.totalValue}>
            {formatCurrency(dailyExpense.replace(/,/g, '') || '0')}
          </Text>
        </View>
      ) : null}
      <Text style={styles.fieldLabel}>Additional Notes</Text>
      <TextInput
        style={styles.textArea}
        multiline
        numberOfLines={4}
        value={dailyNotes}
        onChangeText={setDailyNotes}
        placeholder="Any incidents or notes for the day..."
        placeholderTextColor={MONO.muted}
      />
    </>
  );

  const renderOtherForm = () => (
    <>
      <CustomInput
        label="Cost (₹)"
        value={otherCost}
        onChangeText={setOtherCost}
        keyboardType="numeric"
        placeholder="e.g. 500"
        {...inputProps}
      />
      <Text style={styles.fieldLabel}>Description</Text>
      <TextInput
        style={styles.textArea}
        multiline
        numberOfLines={4}
        value={otherDescription}
        onChangeText={setOtherDescription}
        placeholder="What was this expense for?"
        placeholderTextColor={MONO.muted}
      />
    </>
  );

  const renderServiceForm = () => (
    <>
      <CustomInput
        label="Date"
        value={formatDisplayDate(serviceDate)}
        editable={false}
        {...inputProps}
        rightIcon={<Icon name="calendar-month-outline" size={18} color={MONO.muted} />}
      />
      <CustomInput
        label="Service Type"
        value={serviceType}
        onChangeText={setServiceType}
        placeholder="e.g. Oil Change, General Service"
        {...inputProps}
      />
      <CustomInput
        label="Service Center / Garage"
        value={serviceCenter}
        onChangeText={setServiceCenter}
        placeholder="e.g. Tata Motors Service"
        {...inputProps}
      />
      <CustomInput
        label="Amount (₹)"
        value={serviceAmount}
        onChangeText={setServiceAmount}
        keyboardType="numeric"
        placeholder="e.g. 3500"
        {...inputProps}
      />
      <CustomInput
        label="Odometer (km) — Optional"
        value={serviceOdometer}
        onChangeText={setServiceOdometer}
        keyboardType="numeric"
        placeholder="e.g. 45230"
        {...inputProps}
      />
      <Text style={styles.fieldLabel}>Notes (Optional)</Text>
      <TextInput
        style={styles.textArea}
        multiline
        numberOfLines={3}
        value={serviceNotes}
        onChangeText={setServiceNotes}
        placeholder="Parts replaced, next service due, etc."
        placeholderTextColor={MONO.muted}
      />
    </>
  );

  const renderForm = () => {
    switch (activeCategory) {
      case 'fuel':
        return renderFuelForm();
      case 'toll':
        return renderTollForm();
      case 'repair':
        return renderRepairForm();
      case 'daily':
        return renderDailyForm();
      case 'service':
        return renderServiceForm();
      case 'other':
        return renderOtherForm();
      default:
        return null;
    }
  };

  const saveLabel =
    activeCategory === 'repair'
      ? 'Submit Request'
      : activeCategory === 'daily'
        ? 'Submit Report'
        : activeCategory === 'service'
          ? 'Save Service'
          : 'Save Expense';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={MONO.brand} />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        {navigation.canGoBack?.() ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="arrow-left" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtn} />
        )}
        <Text style={styles.headerTitle}>Add Expense</Text>
        <View style={styles.backBtn} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 56 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
          nestedScrollEnabled
        >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveCategory(cat.id)}
                activeOpacity={0.85}
              >
                <Text
                  style={[styles.tabText, isActive && styles.tabTextActive]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {renderIllustration()}
        {renderForm()}

        {activeCategory !== 'daily' ? (
          <ReceiptUploadButton
            receiptUrl={receiptUrl}
            onReceiptUrlChange={setReceiptUrl}
            uploading={uploadingReceipt}
            onUploadingChange={setUploadingReceipt}
            folder="receipts"
            label={
              activeCategory === 'repair' ? 'Upload Issue Image' : 'Upload Receipt'
            }
            activeColor={MONO.active}
            style={styles.uploadWrap}
          />
        ) : null}

        <TouchableOpacity
          style={[styles.saveBtn, submitting && styles.saveBtnDisabled]}
          onPress={handleSave}
          activeOpacity={0.9}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={MONO.surface} />
          ) : (
            <>
              <Icon name="content-save-outline" size={18} color={MONO.surface} />
              <Text style={styles.saveBtnText}>{saveLabel}</Text>
            </>
          )}
        </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={paymentPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPaymentPickerVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setPaymentPickerVisible(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Select payment</Text>
            {paymentOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => {
                  if (paymentPickerTarget === 'fuel') {
                    setFuelPaymentMethod(option);
                  } else {
                    setTollPaymentType(option);
                  }
                  setPaymentPickerVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    selectedPayment === option && styles.modalOptionTextActive,
                  ]}
                >
                  {option}
                </Text>
                {selectedPayment === option && (
                  <Icon name="check" size={18} color={MONO.active} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MONO.brand },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: MONO.brand,
  },
  backBtn: { width: 36, alignItems: 'flex-start' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', letterSpacing: 0.2 },
  keyboardAvoid: { flex: 1 },
  scrollView: { flex: 1, backgroundColor: MONO.bg },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 120, flexGrow: 1 },
  tabsRow: { paddingBottom: 12, gap: 8 },
  tab: {
    width: 72,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: MONO.active,
    backgroundColor: MONO.surface,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: MONO.active,
    borderColor: MONO.active,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: MONO.active,
    textAlign: 'center',
  },
  tabTextActive: { color: MONO.surface },
  illustrationCard: {
    backgroundColor: MONO.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MONO.border,
    paddingVertical: 16,
    marginBottom: 14,
    alignItems: 'center',
  },
  illustrationInner: {
    width: 110,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationAccent: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  fieldContainer: { marginBottom: 12 },
  fieldLabel: {
    fontSize: 11,
    color: MONO.muted,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  fieldInput: {
    borderRadius: 8,
    height: 42,
    borderColor: MONO.border,
    paddingHorizontal: 10,
  },
  fieldText: {
    fontSize: 14,
    color: MONO.text,
    fontWeight: '400',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  half: { width: '48%' },
  halfInput: { marginBottom: 0 },
  totalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: MONO.tint,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    marginTop: 2,
  },
  totalLabel: { fontSize: 13, fontWeight: '500', color: MONO.brand },
  totalValue: { fontSize: 16, fontWeight: '600', color: MONO.active },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: MONO.border,
    borderRadius: 8,
    backgroundColor: MONO.surface,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 12,
  },
  dropdownText: { fontSize: 14, color: MONO.text, fontWeight: '400' },
  textArea: {
    borderWidth: 1,
    borderColor: MONO.border,
    borderRadius: 8,
    padding: 12,
    color: MONO.text,
    fontSize: 14,
    minHeight: 96,
    textAlignVertical: 'top',
    marginBottom: 12,
    backgroundColor: MONO.surface,
  },
  uploadWrap: { marginBottom: 14 },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MONO.active,
    borderRadius: 8,
    height: 46,
    gap: 8,
  },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnText: { color: MONO.surface, fontSize: 15, fontWeight: '600' },
  serviceBox: {
    backgroundColor: MONO.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: MONO.border,
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: MONO.text,
    marginTop: 10,
    marginBottom: 6,
  },
  serviceText: {
    fontSize: 13,
    color: MONO.muted,
    textAlign: 'center',
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: MONO.surface,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    padding: 18,
    paddingBottom: 28,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: MONO.text,
    marginBottom: 10,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: MONO.border,
  },
  modalOptionText: { fontSize: 14, color: MONO.text },
  modalOptionTextActive: { color: MONO.active, fontWeight: '600' },
});
