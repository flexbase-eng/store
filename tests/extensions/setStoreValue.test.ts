import { test, expect, describe, beforeEach } from 'vitest';
import { storageManager, defaultStoreComparer, setStoreValue, Store } from '../../src/index';

describe('setStoreValue', () => {
  test('success', async () => {
    const test = storageManager.register<number | undefined>(Symbol(), undefined, defaultStoreComparer, []);

    await setStoreValue(test, 1);
    const value = storageManager.getValue(test);

    expect(value).not.toBeUndefined();
    expect(value).toBe(1);
  });

  test('set undefined', async () => {
    const test = storageManager.register<number | undefined>(Symbol(), undefined, defaultStoreComparer, []);

    await setStoreValue(test, undefined);
    const value = storageManager.getValue(test);

    expect(value).toBeUndefined();
  });

  test('set with callback', async () => {
    const test = storageManager.register<number | undefined>(Symbol(), undefined, defaultStoreComparer, []);

    await setStoreValue(test, _ => 100);
    const value = storageManager.getValue(test);

    expect(value).not.toBeUndefined();
    expect(value).toBe(100);
  });

  test('set with callback advanced', async () => {
    const test = storageManager.register<number>(Symbol(), 100, defaultStoreComparer, []);

    await setStoreValue(test, currentValue => (currentValue ? Math.min(42, currentValue) : 0));
    const value = storageManager.getValue(test);

    expect(value).not.toBeUndefined();
    expect(value).toBe(42);
  });

  test('set undefined with callback', async () => {
    const test = storageManager.register<number | undefined>(Symbol(), undefined, defaultStoreComparer, []);

    await setStoreValue(test, _ => undefined);
    const value = storageManager.getValue(test);

    expect(value).toBeUndefined();
  });
});

test('setStoreValue not registered', async () => {
  const key = Symbol('test');

  await expect(setStoreValue({ key }, undefined)).rejects.toThrow(`Unable to find storage manager for ${key.toString()}`);
});
