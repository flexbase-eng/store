import { StoreComparer } from '../core/StoreComparer';
import { StoreMiddleware } from '../core/StoreMiddleware';
import { PersistanceProvider } from '../persistance/PersistanceProvider';
import { StorageManager } from '../core/StorageManager';

export interface StoreOptions<T> {
  storageManager(storageManager: StorageManager): Omit<StoreOptions<T>, 'storageManager'>;
  key(key: symbol | string): Omit<StoreOptions<T>, 'key'>;
  default(t: T): Omit<StoreOptions<T>, 'default'>;
  comparer(comparer: StoreComparer<T>): Omit<StoreOptions<T>, 'comparer'>;
  middleware(...middleware: StoreMiddleware<T>[]): Omit<StoreOptions<T>, 'middleware'>;
  persistance(persistanceProvider: PersistanceProvider<T>): Omit<StoreOptions<T>, 'persistance'>;
}
