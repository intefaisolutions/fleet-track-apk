import { Platform } from 'react-native';

/** Set true when testing on a physical phone (same Wi‑Fi as your PC). */
export const USE_PHYSICAL_DEVICE = false;

/** Your PC LAN IP — only used when USE_PHYSICAL_DEVICE is true. */
export const PHYSICAL_DEVICE_HOST = '192.168.1.100';

const PRODUCTION_URL = 'https://fleettrackservice.in/api/v1';
const ANDROID_EMULATOR_URL = 'http://10.0.2.2:3000/api/v1';
const IOS_SIMULATOR_URL = 'http://localhost:3000/api/v1';

function resolveDevUrl(): string {
  if (USE_PHYSICAL_DEVICE) {
    return `http://${PHYSICAL_DEVICE_HOST}:3000/api/v1`;
  }
  return Platform.OS === 'android' ? ANDROID_EMULATOR_URL : IOS_SIMULATOR_URL;
}

/** Toggle __DEV__ to hit local NestJS; release builds use production. */
export const API_BASE_URL = __DEV__ ? resolveDevUrl() : PRODUCTION_URL;
