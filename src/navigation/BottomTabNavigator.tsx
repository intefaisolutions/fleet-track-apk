import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { MyExpensesScreen } from '../screens/expenses/MyExpensesScreen';
import { AddExpenseMainScreen } from '../screens/expenses/AddExpenseMainScreen';
import { DriverProfileScreen } from '../screens/profile/DriverProfileScreen';
import { colors } from '../utils/colors';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1DA1F2', // Monochrome Blue when active
        tabBarInactiveTintColor: '#6B7280', // Monochrome Grey when inactive
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60 + insets.bottom, // Auto adjust for gesture bar
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-variant" size={size || 24} color={color} />
          ),
          tabBarLabel: 'Home'
        }}
      />
      <Tab.Screen 
        name="AddExpenseTab" 
        component={AddExpenseMainScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="plus-box" size={size || 24} color={color} />
          ),
          tabBarLabel: 'Add Expense'
        }}
      />
      <Tab.Screen 
        name="MyExpenses" 
        component={MyExpensesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="receipt" size={size || 24} color={color} />
          ),
          tabBarLabel: 'My Expenses'
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={DriverProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size || 24} color={color} />
          ),
          tabBarLabel: 'Profile'
        }}
      />
    </Tab.Navigator>
  );
};
