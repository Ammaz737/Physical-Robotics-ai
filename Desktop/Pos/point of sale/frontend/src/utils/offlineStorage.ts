// Offline Storage Utility for POS System
// Handles data persistence when offline and syncs when online

interface OfflineRecord {
  id: string;
  table: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  data: any;
  timestamp: number;
  synced: boolean;
}

class OfflineStorage {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'POSOfflineDB';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'offlineRecords';

  // Initialize IndexedDB
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
          store.createIndex('table', 'table', { unique: false });
          store.createIndex('synced', 'synced', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // Store data offline
  async storeOffline(table: string, action: 'CREATE' | 'UPDATE' | 'DELETE', data: any): Promise<string> {
    if (!this.db) await this.init();

    const record: OfflineRecord = {
      id: `${table}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      table,
      action,
      data,
      timestamp: Date.now(),
      synced: false
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.add(record);

      request.onsuccess = () => resolve(record.id);
      request.onerror = () => reject(request.error);
    });
  }

  // Get all offline records
  async getOfflineRecords(): Promise<OfflineRecord[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Get offline records by table
  async getOfflineRecordsByTable(table: string): Promise<OfflineRecord[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const index = store.index('table');
      const request = index.getAll(table);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Get unsynced records
  async getUnsyncedRecords(): Promise<OfflineRecord[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const index = store.index('synced');
      const request = index.getAll(false);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Mark record as synced
  async markAsSynced(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const record = getRequest.result;
        if (record) {
          record.synced = true;
          const putRequest = store.put(record);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Remove synced record
  async removeSyncedRecord(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Clear all offline data
  async clearAll(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Check if online
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Get connection status
  getConnectionStatus(): 'online' | 'offline' {
    return navigator.onLine ? 'online' : 'offline';
  }

  // Add connection status listener
  onConnectionChange(callback: (status: 'online' | 'offline') => void): void {
    window.addEventListener('online', () => callback('online'));
    window.addEventListener('offline', () => callback('offline'));
  }

  // Remove connection status listener
  offConnectionChange(callback: (status: 'online' | 'offline') => void): void {
    window.removeEventListener('online', () => callback('online'));
    window.removeEventListener('offline', () => callback('offline'));
  }
}

// Local Storage utilities for simple data
export class LocalStorage {
  static set(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  static get(key: string): any {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return null;
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}

// Cache utilities
export class CacheManager {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  static set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  static get(key: string): any {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  static has(key: string): boolean {
    return this.cache.has(key);
  }

  static delete(key: string): void {
    this.cache.delete(key);
  }

  static clear(): void {
    this.cache.clear();
  }

  static cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Sync manager for handling offline/online data synchronization
export class SyncManager {
  private offlineStorage: OfflineStorage;
  private isSyncing = false;

  constructor() {
    this.offlineStorage = new OfflineStorage();
    this.init();
  }

  private async init(): Promise<void> {
    await this.offlineStorage.init();
    
    // Listen for connection changes
    this.offlineStorage.onConnectionChange((status) => {
      if (status === 'online') {
        this.syncOfflineData();
      }
    });
  }

  // Sync offline data when connection is restored
  async syncOfflineData(): Promise<void> {
    if (this.isSyncing) return;

    try {
      this.isSyncing = true;
      const offlineRecords = await this.offlineStorage.getUnsyncedRecords();

      if (offlineRecords.length === 0) return;

      console.log(`Syncing ${offlineRecords.length} offline records...`);

      for (const record of offlineRecords) {
        try {
          await this.syncRecord(record);
          await this.offlineStorage.markAsSynced(record.id);
          await this.offlineStorage.removeSyncedRecord(record.id);
        } catch (error) {
          console.error(`Failed to sync record ${record.id}:`, error);
        }
      }

      console.log('Offline data sync completed');
    } catch (error) {
      console.error('Offline data sync failed:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  // Sync a single record
  private async syncRecord(record: OfflineRecord): Promise<void> {
    const { table, action, data } = record;
    
    let url = `/api/${table}`;
    let method = 'POST';
    let body = data;

    switch (action) {
      case 'CREATE':
        method = 'POST';
        break;
      case 'UPDATE':
        method = 'PUT';
        url += `/${data.id}`;
        delete body.id;
        break;
      case 'DELETE':
        method = 'DELETE';
        url += `/${data.id}`;
        body = undefined;
        break;
    }

    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status} ${response.statusText}`);
    }
  }

  // Store data offline
  async storeOffline(table: string, action: 'CREATE' | 'UPDATE' | 'DELETE', data: any): Promise<string> {
    return await this.offlineStorage.storeOffline(table, action, data);
  }

  // Get offline data
  async getOfflineData(table?: string): Promise<OfflineRecord[]> {
    if (table) {
      return await this.offlineStorage.getOfflineRecordsByTable(table);
    }
    return await this.offlineStorage.getOfflineRecords();
  }

  // Check if online
  isOnline(): boolean {
    return this.offlineStorage.isOnline();
  }

  // Get connection status
  getConnectionStatus(): 'online' | 'offline' {
    return this.offlineStorage.getConnectionStatus();
  }
}

// Create and export singleton instances
export const offlineStorage = new OfflineStorage();
export const syncManager = new SyncManager();

// Export types
export type { OfflineRecord };
