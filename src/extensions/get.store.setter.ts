import { Store } from '../core/store.interface';
import { StorageManager } from '../core/storage.manager';
import { Setter } from '../core/store.setter';

export const getStoreSetter = <T>(store: Store<T>): Setter<T> => {
  const mgr = StorageManager.lookupManager(store);

  if (mgr === undefined) {
    throw new Error(`Unable to find storage manager for ${store.key.toString()}`);
  }

  return mgr.getSetter(store);
};
