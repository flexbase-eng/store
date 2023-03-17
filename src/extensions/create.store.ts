import { defaultStoreComparer } from '../core/store.comparer';
import { storageManager } from '../core/storage.manager';
import { Store } from '../core/store.interface';
import { StoreBuilder } from '../builder/store.builder';
import { StoreOptions } from '../builder/store.options';

export const createStore = async <T>(options?: (builder: StoreOptions<T>) => void): Promise<Store<T>> => {
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

  return await useStorageManager.register(useKey, useDefault, useComparer, useMiddleware, usePersistanceOptions);
};
