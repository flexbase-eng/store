import { Store } from '../core/store.interface.js';
import { StorageManager } from '../core/storage.manager.js';

export const getStoreValue = <T>(store: Store<T>): Readonly<T> | undefined => {
  const mgr = StorageManager.lookupManager(store);

  if (mgr === undefined) {
    throw new Error(`Unable to find storage manager for ${store.key.toString()}`);
  }

  return mgr.getValue(store);
};
