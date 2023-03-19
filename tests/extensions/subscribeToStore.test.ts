import { test, expect } from 'vitest';
import { storageManager, defaultStoreComparer, subscribeToStore } from '../../src/index';

test('subscribeToStore', () => {
  const test = storageManager.register<number>(Symbol(), undefined, defaultStoreComparer, []);

  const subscription = subscribeToStore(test, _ => Promise.resolve());

  expect(subscription).not.toBeNull();
});

test('subscribeToStore not registered', () => {
  const key = Symbol('test');

  expect(() => subscribeToStore({ key }, _ => Promise.resolve())).toThrow(`Unable to find storage manager for ${key.toString()}`);
});
