import { test, expect, describe } from 'vitest';
import { storageManager, defaultStoreComparer, resetStoreValue } from '../../src/index';

describe('resetStoreValue', () => {
  test('default is undefined', async () => {
    const test = storageManager.register<number | undefined>(Symbol(), undefined, defaultStoreComparer, []);

    await storageManager.setValue(test, 1);
    let value = storageManager.getValue(test);

    expect(value).not.toBeUndefined();
    expect(value).toBe(1);

    await resetStoreValue(test);

    value = storageManager.getValue(test);

    expect(value).toBeUndefined();
  });

  test('to default', async () => {
    const test = storageManager.register<number | undefined>(Symbol(), 42, defaultStoreComparer, []);

    await storageManager.setValue(test, 1);
    let value = storageManager.getValue(test);

    expect(value).not.toBeUndefined();
    expect(value).toBe(1);

    await resetStoreValue(test);

    value = storageManager.getValue(test);

    expect(value).not.toBeUndefined();
    expect(value).toBe(42);
  });

  test('not registered', async () => {
    const key = Symbol('test');

    await expect(resetStoreValue({ key })).rejects.toThrow(`Unable to find storage manager for ${key.toString()}`);
  });
});
