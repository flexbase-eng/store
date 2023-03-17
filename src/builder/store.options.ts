import { StoreComparer } from '../core/store.comparer';
import { StoreMiddleware } from '../core/store.middleware';
import { PersistanceProvider } from '../persistance/persistance.provider';
import { StorageManager } from '../core/storage.manager';

export interface StoreOptions<T> {
  storageManager(storageManager: StorageManager): Omit<StoreOptions<T>, 'storageManager'>;
  key(key: symbol | string): Omit<StoreOptions<T>, 'key'>;
  default(t: T): Omit<StoreOptions<T>, 'default'>;
  comparer(comparer: StoreComparer<T>): Omit<StoreOptions<T>, 'comparer'>;
  middleware(...middleware: StoreMiddleware<T>[]): Omit<StoreOptions<T>, 'middleware'>;
  persistance(persistanceProvider: PersistanceProvider<T>): Omit<StoreOptions<T>, 'persistance'>;
}
