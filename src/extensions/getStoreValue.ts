import { Store } from '../core/Store';
import { StorageManager } from '../core/StorageManager';

export const getStoreValue = <T>(store: Store<T>): Readonly<T> | undefined => {
  const mgr = StorageManager.lookupManager(store);

  if (mgr === undefined) {
    throw new Error(`Unable to find storage manager for ${store.key.toString()}`);
  }

  return mgr.getValue(store);
};
