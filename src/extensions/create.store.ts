import { defaultStoreComparer } from '../core/store.comparer';
import { storageManager } from '../core/storage.manager';
import { Store } from '../core/store.interface';
import { StoreBuilder } from '../builder/store.builder';
import { StoreOptions, StoreOptionsFluent } from '../builder/store.options';

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
