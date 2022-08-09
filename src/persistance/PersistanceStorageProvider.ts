import { Logger } from '@flexbase/logger';
import { PersistanceContext } from './PersistanceContext';
import { PersistanceProvider } from './PersistanceProvider';
import { PersistanceStorage } from './PersistanceStorage';

export class PersistanceStorageProvider<T> implements PersistanceProvider<T> {
  constructor(private readonly _key: string, private readonly _storage: PersistanceStorage, private readonly _logger?: Logger) {}

  handle(context: PersistanceContext<T>): Promise<void> {
    switch (context.event) {
      case 'read':
        return this.onRead(context.setter);

      case 'write':
        if (context.value === undefined) {
          return this.onClear();
        }
        return this.onWrite(context.value);

      case 'reset':
        if (context.value === undefined) {
          return this.onClear();
        }
        return this.onWrite(context.value);

      default:
        //eslint-disable-next-line no-case-declarations
        const exhaustiveCheck: never = context.event;
        throw new Error(exhaustiveCheck);
    }
  }

  private parseJson(json: string): T | undefined {
    if (json === undefined) {
      return undefined;
    }
    try {
      return JSON.parse(json);
    } catch (e) {
      this._logger?.warn(`Unable to parse ${this._key} retrieved from persistance storage`, e);
      return undefined;
    }
  }

  private async onRead(setter: (value: T | undefined) => void) {
    try {
      const val = await this._storage.getItem(this._key);

      if (val === null || val === undefined) {
        setter(undefined);
        return;
      } else if (typeof val === 'string') {
        setter(this.parseJson(val));
      } else {
        setter(val);
      }
    } catch (e) {
      this._logger?.warn(`Unable to read ${this._key} from persistance storage`, e);
    }
  }

  private async onWrite(value: T) {
    try {
      if (typeof this._storage.mergeItem === 'function') {
        await this._storage.mergeItem(this._key, JSON.stringify(value));
      } else {
        await this._storage.setItem(this._key, JSON.stringify(value));
      }
    } catch (e) {
      this._logger?.warn(`Unable to write ${this._key} to persistance storage`, e);
    }
  }

  private async onClear() {
    try {
      await this._storage.removeItem(this._key);
    } catch (e) {
      this._logger?.warn(`Unable to clear ${this._key} in persistance storage`, e);
    }
  }
}
