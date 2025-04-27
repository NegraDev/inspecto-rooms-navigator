
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.1ce7247a40354abb96928537dd183f37',
  appName: 'inspecto-rooms-navigator',
  webDir: 'dist',
  server: {
    url: 'https://1ce7247a-4035-4abb-9692-8537dd183f37.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      showSpinner: true,
      spinnerColor: "#2563EB"
    }
  },
  ios: {
    contentInset: 'automatic'
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
