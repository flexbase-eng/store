import { StoreComparer } from '../core/StoreComparer';
import { StoreMiddleware } from '../core/StoreMiddleware';
import { PersistanceProvider } from '../persistance/PersistanceProvider';
import { StoreOptions } from './StoreOptions';
import { StorageManager } from '../core/StorageManager';

/** @internal */
export class StoreBuilder<T> implements StoreOptions<T> {
  _storageManager: StorageManager | undefined;
  _key: symbol | undefined;
  _default: T | undefined;
  _comparer: StoreComparer<T> | undefined;
  _middleware: StoreMiddleware<T>[] = [];
  _persistanceProvider: PersistanceProvider<T> | undefined;

  storageManager(storageManager: StorageManager): Omit<StoreOptions<T>, 'storageManager'> {
    this._storageManager = storageManager;
    return this;
  }

  key(key: symbol | string): Omit<StoreOptions<T>, 'key'> {
    if (typeof key === 'string') this._key = Symbol(key);
    else this._key = key;
    return this;
  }

  default(t: T): Omit<StoreOptions<T>, 'default'> {
    this._default = t;
    return this;
  }

  comparer(comparer: StoreComparer<T>): Omit<StoreOptions<T>, 'comparer'> {
    this._comparer = comparer;
    return this;
  }

  middleware(...middleware: StoreMiddleware<T>[]): Omit<StoreOptions<T>, 'middleware'> {
    this._middleware = middleware;
    return this;
  }

  persistance(persistanceProvider: PersistanceProvider<T>): Omit<StoreOptions<T>, 'persistance'> {
    this._persistanceProvider = persistanceProvider;
    return this;
  }
}
