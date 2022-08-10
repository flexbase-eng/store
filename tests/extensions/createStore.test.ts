import { noopLogger } from '@flexbase/logger';
import { It, Mock, Times } from 'moq.ts';
import { createStore, defaultStoreDispatcher, StoreMiddleware, StorageManager, PersistanceProvider } from '../../src/index';

test('createStore', () => {
  const value = createStore();

  expect(value).not.toBeNull();
});

test('createStore generic', () => {
  const value = createStore<number>();

  expect(value).not.toBeNull();
});

test('createStore duplicate key warning', () => {
  const loggerMethod = jest.spyOn(noopLogger, 'warn');

  const key = Symbol('DupTest');

  const value1 = createStore<number>(options => options.key(key));
  const value2 = createStore<number>(options => options.key(key));

  expect(value1).not.toBeNull();
  expect(value2).not.toBeNull();
  expect(Object.is(value1, value2)).toBe(true);

  expect(loggerMethod).toBeCalledTimes(1);
});

test('createStore builder', async () => {
  const sm = new StorageManager(defaultStoreDispatcher, noopLogger);

  const mockPersistanceProvider = new Mock<PersistanceProvider<Test>>();
  mockPersistanceProvider.setup(m => m.handle(It.IsAny())).returnsAsync();

  const fn = { m: (id: string) => id };
  const fnMock = jest.spyOn(fn, 'm');

  interface Test {
    v1: string;
    v2: boolean;
  }

  const middleware: StoreMiddleware<Test> = async (context, next) => {
    fn.m(context.newValue!.v1);
  };

  const testState = createStore<Test>(options => {
    options
      .key('Test')
      .default({ v1: 'test', v2: false })
      .storageManager(sm)
      .comparer((a, b) => a === b)
      .middleware(middleware)
      .persistance(mockPersistanceProvider.object());
  });

  let value = sm.getValue(testState);

  expect(testState.key.toString()).toBe(Symbol('Test').toString());

  expect(value).not.toBeUndefined();
  expect(value!.v1).toBe('test');
  expect(value!.v2).toBe(false);

  await sm.setValue(testState, { v1: '1', v2: true });

  value = sm.getValue(testState);

  expect(value).not.toBeUndefined();
  expect(value!.v1).toBe('1');
  expect(value!.v2).toBe(true);

  expect(fnMock).toBeCalledTimes(1);
  mockPersistanceProvider.verify(m => m.handle(It.IsAny()), Times.Exactly(2));
});
