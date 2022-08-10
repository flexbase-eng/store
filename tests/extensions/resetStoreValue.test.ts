import { storageManager, defaultStoreComparer, resetStoreValue } from '../../src/index';

test('resetStoreValue', async () => {
  const test = storageManager.register<number>(Symbol(), undefined, defaultStoreComparer, []);

  await storageManager.setValue(test, 1);
  let value = storageManager.getValue(test);

  expect(value).not.toBeUndefined();
  expect(value).toBe(1);

  await resetStoreValue(test);

  value = storageManager.getValue(test);

  expect(value).toBeUndefined();
});

test('resetStoreValue not registered', async () => {
  const key = Symbol('test');

  await expect(resetStoreValue({ key })).rejects.toThrow(`Unable to find storage manager for ${key.toString()}`);
});
