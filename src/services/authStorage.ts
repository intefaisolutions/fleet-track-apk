import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = '@fleettrack/auth';

export interface PersistedAuth {
  token: string;
  refreshToken?: string;
  user: Record<string, unknown>;
}

export async function saveAuthSession(session: PersistedAuth): Promise<void> {
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(session));
}

export async function loadAuthSession(): Promise<PersistedAuth | null> {
  const raw = await AsyncStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PersistedAuth;
  } catch {
    return null;
  }
}

export async function clearAuthSession(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_KEY);
}
