import { Subscription, SubscriptionCallback } from '@flexbase/observable-subject';
import { Store } from '../core/Store';
import { StorageManager } from '../core/StorageManager';

export const subscribeToStore = <T>(store: Store<T>, callback: SubscriptionCallback<T>): Subscription => {
  const mgr = StorageManager.lookupManager(store);

  if (mgr === undefined) {
    throw Error(`Unable to find storage manager for ${store.key.toString()}`);
  }

  return mgr.subscribe(store, callback);
};
