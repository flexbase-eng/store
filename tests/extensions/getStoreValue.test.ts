import { test, expect } from 'vitest';
import { storageManager, defaultStoreComparer, getStoreValue } from '../../src/index';

test('getStoreValue', async () => {
  const test = storageManager.register<number | undefined>(Symbol(), undefined, defaultStoreComparer, []);

  await storageManager.setValue(test, 1);

  const value = getStoreValue(test);

  expect(value).toBe(1);
});

test('getStoreValue not registered', () => {
  const key = Symbol('test');

  expect(() => getStoreValue({ key })).toThrow(`Unable to find storage manager for ${key.toString()}`);
});
