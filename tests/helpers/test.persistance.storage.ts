import { PersistanceStorage } from '../../src';

export class TestPersistanceStorage implements PersistanceStorage {
  private readonly _values = new Map<string, string>();

  setItem(key: string, value: string): void | Promise<void> {
    this._values.set(key, value);
    return Promise.resolve();
  }

  getItem(key: string): string | Promise<string> | null {
    if (!this._values.has(key)) {
      return null;
    }
    const value = this._values.get(key);
    return value ? Promise.resolve(value) : null;
  }

  removeItem(key: string): void | Promise<void> {
    this._values.delete(key);
    return Promise.resolve();
  }
}
