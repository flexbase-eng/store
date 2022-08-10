import { Store } from '../core/Store';
import { StorageManager } from '../core/StorageManager';
import { SetterCallback } from '../core/StoreSetter';

export const setStoreValue = async <T>(store: Store<T>, setter: SetterCallback<T>): Promise<void> => {
  const mgr = StorageManager.lookupManager(store);

  if (mgr === undefined) {
    throw Error(`Unable to find storage manager for ${store.key.toString()}`);
  }

  await mgr.setValue(store, setter);
};
