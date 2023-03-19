import { PersistanceStorage } from '../../src';

export class ThrowPersistanceStorage implements PersistanceStorage {
  private readonly _values = new Map<string, string>();

  setItem(key: string, value: string): void | Promise<void> {
    throw new Error('ThrowPersistanceStorage setItem');
  }

  getItem(key: string): string | Promise<string> | null {
    throw new Error('ThrowPersistanceStorage getItem');
  }

  removeItem(key: string): void | Promise<void> {
    throw new Error('ThrowPersistanceStorage removeItem');
  }
}
