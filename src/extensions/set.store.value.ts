import { Store } from '../core/store.interface';
import { StorageManager } from '../core/storage.manager';
import { SetterCallback } from '../core/store.setter';

export const setStoreValue = async <T>(store: Store<T>, setter: SetterCallback<T>): Promise<void> => {
  const mgr = StorageManager.lookupManager(store);

  if (mgr === undefined) {
    throw Error(`Unable to find storage manager for ${store.key.toString()}`);
  }

  await mgr.setValue(store, setter);
};
