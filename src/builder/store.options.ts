import { StoreComparer } from '../core/store.comparer.js';
import { StoreMiddleware } from '../core/store.middleware.js';
import { PersistanceProvider } from '../persistance/persistance.provider.js';
import { StorageManager } from '../core/storage.manager.js';

export interface StoreOptions<T> {
  storageManager?: StorageManager;
  key?: symbol;
  comparer?: StoreComparer<T>;
  middleware?: StoreMiddleware<T>[];
  persistanceProvider?: PersistanceProvider<T>;
}

export interface StoreOptionsFluent<T> {
  storageManager(storageManager: StorageManager): Omit<StoreOptionsFluent<T>, 'storageManager'>;
  key(key: symbol | string): Omit<StoreOptionsFluent<T>, 'key'>;
  comparer(comparer: StoreComparer<T>): Omit<StoreOptionsFluent<T>, 'comparer'>;
  middleware(...middleware: StoreMiddleware<T>[]): Omit<StoreOptionsFluent<T>, 'middleware'>;
  persistanceProvider(persistanceProvider: PersistanceProvider<T>): Omit<StoreOptionsFluent<T>, 'persistanceProvider'>;
}
