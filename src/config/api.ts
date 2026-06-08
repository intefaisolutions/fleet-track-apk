import { Platform } from 'react-native';

/**
 * Live backend (API calls).
 * Swagger docs: https://fleettrackservice.in/api/docs
 * APK base URL must be /api/v1 — not /api/docs.
 */
export const LIVE_API_URL = 'https://fleettrackservice.in/api/v1';

/** true = live server | false = local backend (emulator / PC) */
export const USE_LIVE_API = true;

/** Set true when testing on a physical phone against local backend. */
export const USE_PHYSICAL_DEVICE = false;

/** Your PC LAN IP — only used when USE_LIVE_API is false and USE_PHYSICAL_DEVICE is true. */
export const PHYSICAL_DEVICE_HOST = '192.168.1.100';

const ANDROID_EMULATOR_URL = 'http://10.0.2.2:3000/api/v1';
const IOS_SIMULATOR_URL = 'http://localhost:3000/api/v1';

function resolveLocalUrl(): string {
  if (USE_PHYSICAL_DEVICE) {
    return `http://${PHYSICAL_DEVICE_HOST}:3000/api/v1`;
  }
  return Platform.OS === 'android' ? ANDROID_EMULATOR_URL : IOS_SIMULATOR_URL;
}

export const API_BASE_URL = USE_LIVE_API ? LIVE_API_URL : resolveLocalUrl();
