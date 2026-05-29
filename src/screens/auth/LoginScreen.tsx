import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Image,
  Dimensions,
  StatusBar
} from 'react-native';
import { useDispatch } from 'react-redux';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { loginSuccess } from '../../redux/slices/authSlice';
import { colors } from '../../utils/colors';

const { width, height } = Dimensions.get('window');

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email.toLowerCase() === 'driver@test.com' && password === 'password') {
        dispatch(loginSuccess({
          user: { id: 1, name: 'John Driver', role: 'driver', vehicle: 'DL 01 AB 1234' },
          token: 'dummy-token-123'
        }));
      } else {
        Alert.alert('Error', 'Invalid credentials. Use driver@test.com / password');
      }
    }, 1500);
  };

  const content = (
    <ScrollView 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      bounces={false}
    >
      {/* Background that scrolls with content */}
      <View style={styles.background}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />
      </View>

      <View style={styles.topSection}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/logo.jpg')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.welcomeText}>FleetTrack</Text>
        <Text style={styles.subtitleText}>Fleet Expense Management</Text>
        <View style={styles.cyanDivider} />
      </View>

      <View style={styles.formCard}>
        <CustomInput
          label="Email Address"
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <CustomInput
          label="Password"
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          rightIcon={
            <Text 
              style={styles.toggleText} 
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          }
        />

        <Text style={styles.forgotPassword} onPress={() => Alert.alert('Info', 'Forgot password feature coming soon')}>
          Forgot Password?
        </Text>

        <CustomButton
          title="Sign In"
          onPress={handleLogin}
          loading={loading}
          style={styles.loginBtn}
        />
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Need help? </Text>
          <Text style={styles.supportText} onPress={() => Alert.alert('Support', 'Contacting support...')}>
            Contact Support
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E325C" />

      {/* Main Content */}
      <KeyboardAvoidingView 
        behavior="padding" 
        style={styles.keyboardView}
      >
        {content}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.45,
    backgroundColor: '#1E325C',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  circle1: {
    position: 'absolute',
    width: width,
    height: width,
    borderRadius: width / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    top: -width * 0.4,
    left: -width * 0.2,
  },
  circle2: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    top: -width * 0.1,
    right: -width * 0.3,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: height * 0.12, // 12% of screen height puts it perfectly in the blue area
    paddingBottom: 40,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    padding: 10,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subtitleText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  cyanDivider: {
    width: 40,
    height: 4,
    backgroundColor: '#06B6D4',
    borderRadius: 2,
    marginTop: 16,
  },
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
  toggleText: {
    color: colors.primary,
    fontWeight: '700',
    padding: 4,
    fontSize: 14,
  },
  forgotPassword: {
    color: colors.primary,
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 24,
    fontWeight: '600',
    fontSize: 14,
  },
  loginBtn: {
    marginTop: 8,
    height: 54,
    borderRadius: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  supportText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
