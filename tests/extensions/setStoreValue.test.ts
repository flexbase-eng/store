import { test, expect } from 'vitest';
import { storageManager, defaultStoreComparer, setStoreValue } from '../../src/index';

test('setStoreValue', async () => {
  const test = await storageManager.register<number>(Symbol(), undefined, defaultStoreComparer, []);

  await setStoreValue(test, 1);
  let value = storageManager.getValue(test);

  expect(value).not.toBeUndefined();
  expect(value).toBe(1);

  await setStoreValue(test, undefined);
  value = storageManager.getValue(test);

  expect(value).toBeUndefined();

  await setStoreValue(test, _ => 100);
  value = storageManager.getValue(test);

  expect(value).not.toBeUndefined();
  expect(value).toBe(100);

  await setStoreValue(test, _ => undefined);
  value = storageManager.getValue(test);

  expect(value).toBeUndefined();
});

test('setStoreValue not registered', async () => {
  const key = Symbol('test');

  await expect(setStoreValue({ key }, undefined)).rejects.toThrow(`Unable to find storage manager for ${key.toString()}`);
});
