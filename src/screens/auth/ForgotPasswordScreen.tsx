import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { authService, getApiErrorMessage, unwrapApi } from '../../services/api';
import { colors } from '../../utils/colors';

type Step = 'email' | 'otp' | 'password';

export const ForgotPasswordScreen = ({ navigation }: any) => {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const normalizedEmail = email.trim().toLowerCase();

  const handleSendOtp = async () => {
    if (!normalizedEmail) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.forgotPassword({ email: normalizedEmail });
      unwrapApi(response);
      setStep('otp');
      Alert.alert(
        'OTP Sent',
        'If an account exists with this email, a 6-digit OTP has been sent. Check your inbox.',
      );
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error, 'Failed to send OTP'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.verifyResetOtp({
        email: normalizedEmail,
        otp: otp.trim(),
      });
      unwrapApi(response);
      setStep('password');
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error, 'Invalid or expired OTP'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill all password fields');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.resetPassword({
        email: normalizedEmail,
        token: otp.trim(),
        newPassword,
      });
      unwrapApi(response);
      Alert.alert('Success', 'Password reset successful. Please sign in with your new password.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error, 'Failed to reset password'));
    } finally {
      setLoading(false);
    }
  };

  const stepTitle =
    step === 'email'
      ? 'Forgot Password'
      : step === 'otp'
        ? 'Verify OTP'
        : 'New Password';

  const stepSubtitle =
    step === 'email'
      ? 'Enter your registered email to receive a 6-digit OTP'
      : step === 'otp'
        ? `Enter the OTP sent to ${normalizedEmail}`
        : 'Create a new password for your account';

  const handlePrimary = () => {
    if (step === 'email') handleSendOtp();
    else if (step === 'otp') handleVerifyOtp();
    else handleResetPassword();
  };

  const primaryLabel =
    step === 'email' ? 'Send OTP' : step === 'otp' ? 'Verify OTP' : 'Reset Password';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E325C" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{stepTitle}</Text>
        <View style={styles.backBtn} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formCard}>
            <Text style={styles.subtitle}>{stepSubtitle}</Text>

            {step === 'email' && (
              <CustomInput
                label="Email Address"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            )}

            {step === 'otp' && (
              <CustomInput
                label="6-Digit OTP"
                placeholder="123456"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
              />
            )}

            {step === 'password' && (
              <>
                <CustomInput
                  label="New Password"
                  placeholder="Min. 8 characters"
                  secureTextEntry={!showPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  rightIcon={
                    <Text
                      style={styles.toggleText}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </Text>
                  }
                />
                <CustomInput
                  label="Confirm Password"
                  placeholder="Re-enter new password"
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </>
            )}

            <CustomButton
              title={primaryLabel}
              onPress={handlePrimary}
              loading={loading}
              style={styles.primaryBtn}
            />

            {step === 'otp' && (
              <TouchableOpacity
                style={styles.resendBtn}
                onPress={handleSendOtp}
                disabled={loading}
              >
                <Text style={styles.resendText}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E325C' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  backBtn: { width: 36, alignItems: 'flex-start' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#FFFFFF' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 24, paddingTop: 8 },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 20,
  },
  toggleText: {
    color: colors.primary,
    fontWeight: '700',
    padding: 4,
    fontSize: 14,
  },
  primaryBtn: { marginTop: 8, height: 54, borderRadius: 12 },
  resendBtn: { alignItems: 'center', marginTop: 16 },
  resendText: { color: colors.primary, fontWeight: '600', fontSize: 14 },
});
