import { Store } from '../core/store.interface.js';
import { StorageManager } from '../core/storage.manager.js';
import { SetterCallback } from '../core/store.setter.js';

export const setStoreValue = async <T>(store: Store<T>, setter: SetterCallback<T>): Promise<void> => {
  const mgr = StorageManager.lookupManager(store);

  if (mgr === undefined) {
    throw Error(`Unable to find storage manager for ${store.key.toString()}`);
  }

  await mgr.setValue(store, setter);
};
