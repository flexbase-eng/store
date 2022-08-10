import { Store } from '../core/Store';
import { StorageManager } from '../core/StorageManager';

export const resetStoreValue = async <T>(store: Store<T>): Promise<void> => {
  const mgr = StorageManager.lookupManager(store);

  if (mgr === undefined) {
    throw new Error(`Unable to find storage manager for ${store.key.toString()}`);
  }

  return await mgr.resetValue(store);
};
