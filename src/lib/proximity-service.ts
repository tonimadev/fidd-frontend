/**
 * Serviço de detecção de proximidade via Geolocalização
 *
 * Monitora a posição do cliente e detecta quando está próximo de uma loja FIDD.
 * Usa watchPosition com baixa precisão para economia de bateria.
 */

import { MobileStoreNearbyResponse } from '@/types/mobile-stores';

export interface ProximityEvent {
  store: MobileStoreNearbyResponse;
  distanceMeters: number;
}

type ProximityCallback = (event: ProximityEvent) => void;

const PROXIMITY_RADIUS_KM = 0.1; // 100 meters
const SNOOZE_DURATION_MS = 60 * 60 * 1000; // 1 hour
const STORAGE_KEY = 'fidd_proximity_snoozed';

/**
 * Calculate distance between two GPS coordinates using the Haversine formula
 */
function calculateDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Get snoozed stores from localStorage
 */
function getSnoozedStores(): Record<number, number> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    const data = JSON.parse(stored) as Record<number, number>;
    const now = Date.now();
    // Clean expired snoozes
    const cleaned: Record<number, number> = {};
    for (const [storeId, expiry] of Object.entries(data)) {
      if (expiry > now) {
        cleaned[Number(storeId)] = expiry;
      }
    }
    return cleaned;
  } catch {
    return {};
  }
}

/**
 * Snooze a store for 1 hour (won't trigger proximity alerts)
 */
export function snoozeStore(storeId: number): void {
  const snoozed = getSnoozedStores();
  snoozed[storeId] = Date.now() + SNOOZE_DURATION_MS;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snoozed));
}

/**
 * Check if a store is currently snoozed
 */
function isStoreSnoozed(storeId: number): boolean {
  const snoozed = getSnoozedStores();
  return (snoozed[storeId] ?? 0) > Date.now();
}

export class ProximityService {
  private watchId: number | null = null;
  private stores: MobileStoreNearbyResponse[] = [];
  private callback: ProximityCallback | null = null;
  private lastTriggeredStoreId: number | null = null;

  /**
   * Check if the Geolocation API is supported
   */
  static isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'geolocation' in navigator;
  }

  /**
   * Start monitoring proximity to a set of stores
   */
  start(stores: MobileStoreNearbyResponse[], onProximity: ProximityCallback): void {
    if (!ProximityService.isSupported()) return;
    
    this.stores = stores;
    this.callback = onProximity;
    this.lastTriggeredStoreId = null;

    this.watchId = navigator.geolocation.watchPosition(
      (position) => this.handlePosition(position),
      (error) => console.warn('Proximity watch error:', error.message),
      {
        enableHighAccuracy: false, // Save battery
        maximumAge: 30000,         // Accept 30-second-old positions
        timeout: 15000,
      }
    );
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.callback = null;
    this.stores = [];
    this.lastTriggeredStoreId = null;
  }

  /**
   * Update the list of stores to monitor
   */
  updateStores(stores: MobileStoreNearbyResponse[]): void {
    this.stores = stores;
  }

  /**
   * Handle a new position update
   */
  private handlePosition(position: GeolocationPosition): void {
    if (!this.callback || this.stores.length === 0) return;

    const { latitude, longitude } = position.coords;

    for (const store of this.stores) {
      if (!store.latitude || !store.longitude) continue;
      if (isStoreSnoozed(store.id)) continue;
      if (store.id === this.lastTriggeredStoreId) continue;

      const distance = calculateDistance(
        latitude, longitude,
        store.latitude, store.longitude
      );

      if (distance <= PROXIMITY_RADIUS_KM) {
        this.lastTriggeredStoreId = store.id;
        this.callback({
          store,
          distanceMeters: Math.round(distance * 1000),
        });
        break; // Only trigger for the closest store
      }
    }
  }
}
