import { Store } from '../core/store.interface.js';
import { StorageManager } from '../core/storage.manager.js';
import { Setter } from '../core/store.setter.js';

export const getStoreSetter = <T>(store: Store<T>): Setter<T> => {
  const mgr = StorageManager.lookupManager(store);

  if (mgr === undefined) {
    throw new Error(`Unable to find storage manager for ${store.key.toString()}`);
  }

  return mgr.getSetter(store);
};
