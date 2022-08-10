import { defaultStoreComparer } from '../core/StoreComparer';
import { storageManager } from '../core/StorageManager';
import { Store } from '../core/Store';
import { StoreBuilder } from '../builder/StoreBuilder';
import { StoreOptions } from '../builder/StoreOptions';

export const createStore = <T>(options?: (builder: StoreOptions<T>) => void): Store<T> => {
  const builder = new StoreBuilder<T>();

  if (options) {
    options(builder);
  }

  const useStorageManager = builder._storageManager ?? storageManager;
  const useKey = builder._key ?? Symbol();
  const useDefault = builder._default ?? undefined;
  const useComparer = builder._comparer ?? defaultStoreComparer;
  const useMiddleware = builder._middleware;
  const usePersistanceOptions = builder._persistanceProvider;

  return useStorageManager.register(useKey, useDefault, useComparer, useMiddleware, usePersistanceOptions);
};
