import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'lockout-app',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
