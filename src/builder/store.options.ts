import { StoreComparer } from '../core/store.comparer';
import { StoreMiddleware } from '../core/store.middleware';
import { PersistanceProvider } from '../persistance/persistance.provider';
import { StorageManager } from '../core/storage.manager';

export type StoreOptions<T> = {
  storageManager?: StorageManager;
  key?: symbol;
  defaultValue?: T;
  comparer?: StoreComparer<T>;
  middleware?: StoreMiddleware<T>[];
  persistanceProvider?: PersistanceProvider<T>;
};

export interface StoreOptionsFluent<T> {
  storageManager(storageManager: StorageManager): Omit<StoreOptionsFluent<T>, 'storageManager'>;
  key(key: symbol | string): Omit<StoreOptionsFluent<T>, 'key'>;
  defaultValue(value: T): Omit<StoreOptionsFluent<T>, 'defaultValue'>;
  comparer(comparer: StoreComparer<T>): Omit<StoreOptionsFluent<T>, 'comparer'>;
  middleware(...middleware: StoreMiddleware<T>[]): Omit<StoreOptionsFluent<T>, 'middleware'>;
  persistanceProvider(persistanceProvider: PersistanceProvider<T>): Omit<StoreOptionsFluent<T>, 'persistanceProvider'>;
}
