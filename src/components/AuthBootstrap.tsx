import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { restoreSession } from '../redux/slices/authSlice';
import { loadAuthSession } from '../services/authStorage';
import { setAuthToken } from '../services/api';
import type { RootState } from '../redux/store';

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const bootstrapped = useSelector((state: RootState) => state.auth.bootstrapped);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const session = await loadAuthSession();
      if (!mounted) return;

      if (session?.token) {
        setAuthToken(session.token);
        dispatch(
          restoreSession({
            user: session.user,
            token: session.token,
            refreshToken: session.refreshToken,
          }),
        );
      } else {
        dispatch(restoreSession(null));
      }

      setReady(true);
    })();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  if (!ready || !bootstrapped) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#02689B" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
});
