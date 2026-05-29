import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import { LoginScreen } from '../screens/auth/LoginScreen';
import { BottomTabNavigator } from './BottomTabNavigator';
import { FuelExpenseScreen } from '../screens/expenses/FuelExpenseScreen';
import { TollExpenseScreen } from '../screens/expenses/TollExpenseScreen';
import { RepairRequestScreen } from '../screens/expenses/RepairRequestScreen';
import { DailyReportScreen } from '../screens/expenses/DailyReportScreen';
import { ExpenseDetailScreen } from '../screens/expenses/ExpenseDetailScreen';
import { colors } from '../utils/colors';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen 
              name="Main" 
              component={BottomTabNavigator} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="FuelExpense" 
              component={FuelExpenseScreen} 
              options={{ title: 'Add Fuel Expense' }}
            />
            <Stack.Screen 
              name="TollExpense" 
              component={TollExpenseScreen} 
              options={{ title: 'Add Toll Expense' }}
            />
            <Stack.Screen 
              name="RepairRequest" 
              component={RepairRequestScreen} 
              options={{ title: 'Repair Request' }}
            />
            <Stack.Screen 
              name="DailyReport" 
              component={DailyReportScreen} 
              options={{ title: 'Daily Report' }}
            />
            <Stack.Screen 
              name="ExpenseDetail" 
              component={ExpenseDetailScreen} 
              options={{ title: 'Expense Details' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
