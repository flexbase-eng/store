import { test, expect } from 'vitest';
import { Mock } from 'moq.ts';
import { defaultStoreComparer, PersistanceProvider, storageManager, StoreMiddleware } from '../../src/index';
import { StoreBuilder } from '../../src/builder/store.builder';

test('StoreBuilder', async () => {
  const builder = new StoreBuilder<number>();

  const middleware: StoreMiddleware<number> = (context, next) => {
    return Promise.resolve();
  };

  const mockPersistanceProvider = new Mock<PersistanceProvider<number>>().object();

  builder
    .storageManager(storageManager)
    .key('test')
    .comparer(defaultStoreComparer)
    .default(1)
    .middleware(middleware)
    .persistance(mockPersistanceProvider);

  expect(builder._key!.toString()).toBe(Symbol('test').toString());
  expect(builder._storageManager).toBe(storageManager);
  expect(builder._default).toBe(1);
  expect(builder._middleware).toContain(middleware);
  expect(builder._persistanceProvider).toBe(mockPersistanceProvider);
});
