import { Logger } from '@flexbase/logger';
import {
  Subject,
  subjectManager,
  multicastDispatcher,
  SubscriptionContext,
  noopSubscription,
  Subscription,
  SubscriptionCallback,
} from '@flexbase/observable-subject';
import { PersistanceProvider } from '../persistance/PersistanceProvider';
import { PersistanceEvent, PersistanceContext } from '../persistance/PersistanceContext';
import { Store } from './Store';
import { StoreComparer } from './StoreComparer';
import { StoreDispatcher, defaultStoreDispatcher } from './StoreDispatcher';
import { StoreMiddleware } from './StoreMiddleware';
import { Setter, SetterCallback } from './StoreSetter';
import { StoreWrapper } from './StoreWrapper';

const _storageReverseLookup = new Map<symbol, StorageManager>();

export class StorageManager {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly _stores = new Map<symbol, StoreWrapper<any>>();

  constructor(private readonly _dispatcher: StoreDispatcher = defaultStoreDispatcher, private _logger?: Logger) {}

  set logger(logger: Logger) {
    this._logger = logger;
  }

  register<T>(
    key: symbol,
    default$: T | undefined,
    comparer: StoreComparer<T>,
    middleware: StoreMiddleware<T>[],
    persistanceProvider?: PersistanceProvider<T>
  ): Store<T> {
    const existing = this._stores.get(key);
    if (existing) {
      this._logger?.warn(`Duplicate store ${key.toString()} already registered`);
      return existing;
    }

    if (_storageReverseLookup.has(key)) {
      this._logger?.warn(`Duplicate store ${key.toString()} already registered with another storage manager`);
    }

    const subject: Subject = { key };

    const wrapper = new StoreWrapper(key, default$, comparer, middleware, subject, persistanceProvider);

    this._stores.set(key, wrapper);
    _storageReverseLookup.set(key, this);

    subjectManager.register(subject, multicastDispatcher);

    this.executeAfterRegister(wrapper);

    return wrapper;
  }

  private executeAfterRegister<T>(store: StoreWrapper<T>): Promise<void> {
    const value = store.value;

    if (store.persistanceProvider) {
      return this.handlePersistance(store.persistanceProvider, 'read', value, store);
    } else if (value) {
      const subContext = { value };
      return subjectManager.notify(store.subject, subContext);
    }

    return Promise.resolve();
  }

  getValue<T>(store: Store<T>): Readonly<T> | undefined {
    const storeWrapper = this._stores.get(store.key);

    if (!storeWrapper) {
      const msg = `Value with key '${store.key.toString()}' has not been registered with this storage manager`;
      this._logger?.warn(msg);
      return undefined;
    }

    return storeWrapper.value;
  }

  private executeSetterCallback<T>(currentValue: T | undefined, setter: SetterCallback<T>): T | undefined {
    if (typeof setter === 'function') {
      const fn = setter as (currentValue: Readonly<T> | undefined) => T;
      return fn(currentValue);
    } else {
      return setter;
    }
  }

  private async handlePersistance<T>(
    provider: PersistanceProvider<T> | undefined,
    event: PersistanceEvent,
    value: T | undefined,
    store: StoreWrapper<T>
  ): Promise<void> {
    if (provider === undefined) {
      return;
    }

    const setter = (val: T | undefined) => {
      if (val === undefined) store.reset();
      else store.setValue(val);
    };

    const context: PersistanceContext<T> = { value, event, setter };
    await provider.handle(context);
  }

  // TODO: block reentrancy?
  private async _setValue<T>(store: StoreWrapper<T>, setter: SetterCallback<T>): Promise<void> {
    const currentValue = store.value;
    const newValue = this.executeSetterCallback(currentValue, setter);

    if (!store.comparer(newValue, currentValue)) {
      await this._dispatcher.dispatch({ newValue, currentValue }, store.middleware);

      store.setValue(newValue);

      await this.handlePersistance(store.persistanceProvider, 'write', newValue, store);

      const subContext: SubscriptionContext<T | undefined> = { value: newValue };

      subjectManager.notify(store.subject, subContext);
    }
  }

  async setValue<T>(store: Store<T>, setter: SetterCallback<T>): Promise<void> {
    const storeWrapper = this._stores.get(store.key);

    if (!storeWrapper) {
      const msg = `Value with key '${store.key.toString()}' has not been registered with this storage manager`;
      this._logger?.warn(msg);
      return Promise.resolve();
    }

    return this._setValue(storeWrapper, setter);
  }

  resetValue<T>(store: Store<T>): Promise<void> {
    const storeWrapper = this._stores.get(store.key);

    if (!storeWrapper) {
      const msg = `Value with key '${store.key.toString()}' has not been registered with this storage manager`;
      this._logger?.warn(msg);
      return Promise.resolve();
    }

    const defaultValue = storeWrapper.default;

    return this._setValue(storeWrapper, defaultValue);
  }

  getSetter<T>(store: Store<T>): Setter<T> {
    const storeWrapper = this._stores.get(store.key);

    if (!storeWrapper) {
      return (setter: SetterCallback<T>) => {
        this._logger?.warn(`Trying to set value with key '${store.key.toString()}' which has not been registered with this storage manager`);
        return Promise.resolve();
      };
    }

    return (setter: SetterCallback<T>) => {
      return this._setValue(storeWrapper, setter);
    };
  }

  subscribe<T>(store: Store<T>, callback: SubscriptionCallback<T>): Subscription {
    const storeWrapper = this._stores.get(store.key);

    if (!storeWrapper) {
      this._logger?.warn(`Trying to subscribe to store '${store.key.toString()}' which has not been registered with this storage manager`);
      return noopSubscription;
    }

    return subjectManager.subscribe(storeWrapper.subject, callback);
  }
}

/** Represents a global storage manager instance */
export const storageManager = new StorageManager();
