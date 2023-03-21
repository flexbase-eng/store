import { defaultStoreComparer } from '../core/store.comparer.js';
import { storageManager } from '../core/storage.manager.js';
import { Store } from '../core/store.interface.js';
import { StoreBuilder } from '../builder/store.builder.js';
import { StoreOptions, StoreOptionsFluent } from '../builder/store.options.js';

/**
 * Creates a store
 */
export const createStore = <T>(options?: ((builder: StoreOptionsFluent<T>) => void) | StoreOptions<T>): Store<T> => {
  const builder = new StoreBuilder<T>(options);

  const builtOptions = builder.build();

  const useStorageManager = builtOptions?.storageManager ?? storageManager;
  const key = builtOptions?.key ?? Symbol();
  const defaultValue = builtOptions?.defaultValue ?? undefined;
  const comparer = builtOptions?.comparer ?? defaultStoreComparer;
  const middleware = builtOptions?.middleware ?? [];
  const persistanceProvider = builtOptions?.persistanceProvider;

  return useStorageManager.register(key, defaultValue, comparer, middleware, persistanceProvider);
};
