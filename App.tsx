import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthBootstrap } from './src/components/AuthBootstrap';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AuthBootstrap>
          <AppNavigator />
        </AuthBootstrap>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
