import { storageManager, defaultStoreComparer, getStoreSetter } from '../../src/index';

test('getStoreSetter', async () => {
  const test = storageManager.register<number>(Symbol(), undefined, defaultStoreComparer, []);

  const setter = getStoreSetter(test);

  await setter(1);
  let value = storageManager.getValue(test);

  expect(value).not.toBeUndefined();
  expect(value).toBe(1);

  await setter(undefined);
  value = storageManager.getValue(test);

  expect(value).toBeUndefined();

  await setter(_ => 100);
  value = storageManager.getValue(test);

  expect(value).not.toBeUndefined();
  expect(value).toBe(100);

  await setter(_ => undefined);
  value = storageManager.getValue(test);

  expect(value).toBeUndefined();
});

test('getStoreSetter not registered', () => {
  const key = Symbol('test');

  expect(() => getStoreSetter({ key })).toThrow(`Unable to find storage manager for ${key.toString()}`);
});
