import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getPerformance, FirebasePerformance } from "firebase/performance";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app;
try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  } else {
    // Em desenvolvimento, se não houver config, não inicializa Firebase ou inicializa um dummy
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Firebase] Configuração ausente. Algumas funcionalidades (Analytics/Performance) podem não funcionar.');
    }
  }
} catch (error) {
  console.error('[Firebase] Erro ao inicializar:', error);
}

let analytics: Analytics | null = null;
let performance: FirebasePerformance | null = null;

if (typeof window !== "undefined" && app) {
  try {
    analytics = getAnalytics(app);
    performance = getPerformance(app);
  } catch (error) {
    console.warn('[Firebase] Erro ao carregar serviços extras:', error);
  }
}

export { app, analytics, performance };
