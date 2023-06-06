import { StoreComparer } from '../core/store.comparer.js';
import { StoreMiddleware } from '../core/store.middleware.js';
import { PersistanceProvider } from '../persistance/persistance.provider.js';
import { StoreOptions, StoreOptionsFluent } from './store.options.js';
import { StorageManager } from '../core/storage.manager.js';

/** @internal */
export class StoreBuilder<T> implements StoreOptionsFluent<T> {
  private readonly _options: StoreOptions<T>;

  constructor(options?: ((builder: StoreOptionsFluent<T>) => void) | StoreOptions<T>) {
    if (typeof options === 'function') {
      this._options = {};
      options(this);
    } else {
      this._options = { ...options };
    }
  }

  storageManager(storageManager: StorageManager): Omit<StoreOptionsFluent<T>, 'storageManager'> {
    this._options.storageManager = storageManager;
    return this;
  }

  key(key: symbol | string): Omit<StoreOptionsFluent<T>, 'key'> {
    if (typeof key === 'string') this._options.key = Symbol(key);
    else this._options.key = key;
    return this;
  }

  // defaultValue(value: T): Omit<StoreOptionsFluent<T>, 'default'> {
  //   this._options.defaultValue = value;
  //   return this;
  // }

  comparer(comparer: StoreComparer<T>): Omit<StoreOptionsFluent<T>, 'comparer'> {
    this._options.comparer = comparer;
    return this;
  }

  middleware(...middleware: StoreMiddleware<T>[]): Omit<StoreOptionsFluent<T>, 'middleware'> {
    this._options.middleware = middleware;
    return this;
  }

  persistanceProvider(persistanceProvider: PersistanceProvider<T>): Omit<StoreOptionsFluent<T>, 'persistance'> {
    this._options.persistanceProvider = persistanceProvider;
    return this;
  }

  build(): StoreOptions<T> {
    return this._options;
  }
}
