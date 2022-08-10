import { Store } from '../core/Store';
import { StorageManager } from '../core/StorageManager';
import { Setter } from '../core/StoreSetter';

export const getStoreSetter = <T>(store: Store<T>): Setter<T> => {
  const mgr = StorageManager.lookupManager(store);

  if (mgr === undefined) {
    throw Error(`Unable to find storage manager for ${store.key.toString()}`);
  }

  return mgr.getSetter(store);
};
