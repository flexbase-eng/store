import { Store } from '../core/store.interface';
import { StorageManager } from '../core/storage.manager';

export const getStoreValue = <T>(store: Store<T>): Readonly<T> | undefined => {
  const mgr = StorageManager.lookupManager(store);

  if (mgr === undefined) {
    throw new Error(`Unable to find storage manager for ${store.key.toString()}`);
  }

  return mgr.getValue(store);
};
