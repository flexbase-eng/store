import { test, expect, describe } from 'vitest';
import { Mock } from 'moq.ts';
import { defaultStoreComparer, PersistanceProvider, storageManager, StoreMiddleware } from '../../src/index';
import { StoreBuilder } from '../../src/builder/store.builder';

describe('StoreBuilder', () => {
  test('options object', () => {
    const testMiddleware: StoreMiddleware<number> = (context, next) => {
      return Promise.resolve();
    };

    const middleware = new Array<StoreMiddleware<number>>();
    middleware.push(testMiddleware);

    const mockPersistanceProvider = new Mock<PersistanceProvider<number>>().object();

    const builder = new StoreBuilder<number>({
      storageManager,
      key: Symbol('test'),
      comparer: defaultStoreComparer,
      // defaultValue: 1,
      middleware,
      persistanceProvider: mockPersistanceProvider,
    });

    const options = builder.build();

    expect(options.key!.toString()).toBe(Symbol('test').toString());
    expect(options.storageManager).toBe(storageManager);
    // expect(options.defaultValue).toBe(1);
    expect(options.middleware).toContain(testMiddleware);
    expect(options.persistanceProvider).toBe(mockPersistanceProvider);
  });

  test('fluent options', async () => {
    const builder = new StoreBuilder<number>();

    const middleware: StoreMiddleware<number> = (context, next) => {
      return Promise.resolve();
    };

    const mockPersistanceProvider = new Mock<PersistanceProvider<number>>().object();

    builder
      .storageManager(storageManager)
      .key('test')
      .comparer(defaultStoreComparer)
      // .defaultValue(1)
      .middleware(middleware)
      .persistanceProvider(mockPersistanceProvider);

    const options = builder.build();

    expect(options.key!.toString()).toBe(Symbol('test').toString());
    expect(options.storageManager).toBe(storageManager);
    // expect(options.defaultValue).toBe(1);
    expect(options.middleware).toContain(middleware);
    expect(options.persistanceProvider).toBe(mockPersistanceProvider);
  });
});
