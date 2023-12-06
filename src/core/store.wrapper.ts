import { Subject } from '@flexbase/observable-subject';
import { PersistanceProvider } from '../persistance/persistance.provider.js';
import { Store } from './store.interface.js';
import { StoreComparer } from './store.comparer.js';
import { StoreMiddleware } from './store.middleware.js';
import { StoreDebounceOptions } from './store.debounce.js';

interface ValueWrapper<T> {
  value: T;
}

interface DebounceState {
  delayInMilliseconds: number;
  timeout?: ReturnType<typeof setTimeout>;
}

/** @internal */
export class StoreWrapper<T> implements Store<T> {
  private _valueWrapper: ValueWrapper<T> | null = null;
  private _debounceState: DebounceState | undefined;

  constructor(
    private readonly _key: symbol,
    private readonly _default: T,
    private readonly _comparer: StoreComparer<T>,
    private readonly _middleware: StoreMiddleware<T>[],
    private readonly _subject: Subject,
    private readonly _persistanceProvider?: PersistanceProvider<T>,
    debounceOptions?: StoreDebounceOptions,
  ) {
    if (debounceOptions && debounceOptions.delayInMilliseconds >= 1) {
      this._debounceState = {
        delayInMilliseconds: debounceOptions.delayInMilliseconds,
      };
    }
  }

  get key(): symbol {
    return this._key;
  }

  hasBeenSet(): boolean {
    return this._valueWrapper !== null;
  }

  get value(): T {
    return this._valueWrapper ? this._valueWrapper.value : this._default;
  }

  get default(): T {
    return this._default;
  }

  setValue(value: T | undefined): void {
    if (value === undefined) this._valueWrapper = null;
    else this._valueWrapper = { value };
  }

  reset(): void {
    this._valueWrapper = null;
  }

  get comparer(): StoreComparer<T> {
    return this._comparer;
  }

  get middleware(): StoreMiddleware<T>[] {
    return this._middleware;
  }

  get subject(): Subject {
    return this._subject;
  }

  get persistanceProvider(): PersistanceProvider<T> | undefined {
    return this._persistanceProvider;
  }

  get debouceState(): DebounceState | undefined {
    return this._debounceState;
  }
}
