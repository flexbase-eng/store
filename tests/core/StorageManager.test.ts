import { noopLogger } from '@flexbase/logger';
import { It, Mock, Times } from 'moq.ts';
import { defaultStoreComparer, defaultStoreDispatcher, PersistanceProvider, storageManager, StorageManager, StoreMiddleware } from '../../src/index';

interface TestValue {
  id: number;
  name: string;
}

test('global storageManager created', () => {
  expect(storageManager).not.toBeNull();
});

test('create storageManager', () => {
  const storageManager = new StorageManager();

  expect(storageManager).not.toBeNull();
});

test('storageManager get value success', () => {
  const test = storageManager.register(Symbol(), { id: 1, name: 'test' }, (_, $) => true, []);
  const value = storageManager.getValue(test);

  expect(value).not.toBeUndefined();

  expect(value!.id).toBe(1);
  expect(value!.name).toBe('test');
});

test('storageManager get value undefined', () => {
  const test = storageManager.register(Symbol(), undefined, (_, $) => true, []);
  const value = storageManager.getValue(test);

  expect(value).toBeUndefined();
});

test('storageManager duplicate registration warning', () => {
  const loggerMethod = jest.spyOn(noopLogger, 'warn');

  const key = Symbol('DupTest');

  const value1 = storageManager.register<number>(key, 1, (_, $) => true, []);
  const value2 = storageManager.register<number>(key, 1, (_, $) => true, []);

  expect(value1).not.toBeNull();
  expect(value2).not.toBeNull();
  expect(Object.is(value1, value2)).toBe(true);

  expect(loggerMethod).toBeCalledTimes(1);
});

test('multiple storageManager duplicate registration warning', () => {
  const loggerMethod = jest.spyOn(noopLogger, 'warn');

  const key = Symbol('DupTest');

  const value1 = storageManager.register<number>(key, 1, (_, $) => true, []);

  const sm = new StorageManager(undefined, noopLogger);

  const value2 = sm.register<number>(key, undefined, (_, $) => true, []);

  expect(value1).not.toBeNull();
  expect(value2).not.toBeNull();
  expect(Object.is(value1, value2)).toBe(false);

  expect(loggerMethod).toBeCalledTimes(1);
});

test('storageManager get setter', async () => {
  const test = storageManager.register(Symbol(), { id: 0, name: 't' }, defaultStoreComparer, []);

  const setTest = storageManager.getSetter(test);

  await setTest({ id: 1, name: 'test' });

  const value = storageManager.getValue(test);

  expect(value).not.toBeUndefined();

  expect(value!.id).toBe(1);
  expect(value!.name).toBe('test');
});

test('storageManager set value', async () => {
  const test = storageManager.register(Symbol(), { id: 0, name: 't' }, defaultStoreComparer, []);

  await storageManager.setValue(test, { id: 1, name: 'test' });

  const value = storageManager.getValue(test);

  expect(value).not.toBeUndefined();

  expect(value!.id).toBe(1);
  expect(value!.name).toBe('test');
});

test('storageManager set value not registered', async () => {
  const loggerMethod = jest.spyOn(noopLogger, 'warn');

  const test = storageManager.register(Symbol(), { id: 0, name: 't' }, defaultStoreComparer, []);

  const sm = new StorageManager(undefined, noopLogger);
  await sm.setValue(test, { id: 1, name: 'test' });

  const value = storageManager.getValue(test);

  expect(value).not.toBeUndefined();

  expect(value!.id).toBe(0);
  expect(value!.name).toBe('t');

  expect(loggerMethod).toBeCalledTimes(1);
});

test('storageManager single middleware', async () => {
  const fn = { m: (id: number) => id + 1 };
  const fnMock = jest.spyOn(fn, 'm');

  const middleware: StoreMiddleware<TestValue> = (context, next) => {
    fn.m(context.newValue!.id);
    return next();
  };

  const test = storageManager.register<TestValue>(Symbol(), undefined, defaultStoreComparer, [middleware]);

  await storageManager.setValue(test, { id: 1, name: 'test' });

  const value = storageManager.getValue(test);

  expect(value).not.toBeUndefined();

  expect(value!.id).toBe(1);
  expect(value!.name).toBe('test');

  expect(fnMock).toBeCalledTimes(1);
});

test('storageManager multiple middleware', async () => {
  const fn = { m: (id: number) => id + 1 };
  const fnMock = jest.spyOn(fn, 'm');

  const middleware1: StoreMiddleware<number> = async (context, next) => {
    await new Promise(_ => setTimeout(_, context.newValue));
    return next();
  };

  const middleware2: StoreMiddleware<number> = async (context, next) => {
    fn.m(context.newValue!);
    return next();
  };

  const test = storageManager.register(Symbol(), undefined, defaultStoreComparer, [middleware2, middleware1, middleware2]);

  const setTest = storageManager.getSetter(test);

  await setTest(_ => 1000);

  const value = storageManager.getValue(test);

  expect(value).not.toBeUndefined();

  expect(value).toBe(1000);

  expect(fnMock).toBeCalledWith(1000);
});

test('storageManager default comparer', async () => {
  const fn = { m: (id?: string) => id };
  const fnMock = jest.spyOn(fn, 'm');

  const middleware: StoreMiddleware<string> = (context, next) => {
    fn.m(context.newValue);
    return next();
  };

  const test = storageManager.register(Symbol(), undefined, defaultStoreComparer, [middleware]);

  const setTest = storageManager.getSetter(test);

  await setTest('test');

  const value = storageManager.getValue(test);

  expect(value).not.toBeUndefined();

  expect(value).toBe('test');

  expect(fnMock).toBeCalledWith('test');

  setTest('test');

  expect(fnMock).toBeCalledTimes(1);
});

test('storageManager default comparer for object', async () => {
  const fn = { m: (id?: string) => id };
  const fnMock = jest.spyOn(fn, 'm');

  const testValue = { name: 'test' };

  const middleware: StoreMiddleware<typeof testValue> = (context, next) => {
    fn.m(context.newValue?.name);
    return next();
  };

  const test = storageManager.register<typeof testValue>(Symbol(), undefined, defaultStoreComparer, [middleware]);

  const setTest = storageManager.getSetter(test);

  await setTest(_ => {
    return testValue;
  });

  const value = storageManager.getValue(test);

  expect(value).not.toBeUndefined();
  expect(value!.name).toBe('test');

  expect(fnMock).toBeCalledWith('test');

  setTest(testValue);

  expect(fnMock).toBeCalledTimes(1);
});

test('storageManager getValue not registered', () => {
  const key = Symbol('NotRegistered');
  const loggerMethod = jest.spyOn(noopLogger, 'warn');

  const testState = storageManager.register<number>(key, 1, defaultStoreComparer, []);

  const sm = new StorageManager(defaultStoreDispatcher, noopLogger);

  const value = sm.getValue(testState);

  expect(value).toBeUndefined();
  expect(loggerMethod).toBeCalledTimes(1);
});

test('storageManager getSetter not registered', async () => {
  const key = Symbol('NotRegistered');
  const loggerMethod = jest.spyOn(noopLogger, 'warn');

  const testState = storageManager.register<number>(key, 100, defaultStoreComparer, []);

  const sm = new StorageManager(defaultStoreDispatcher, noopLogger);

  const setter = sm.getSetter(testState);

  await setter(1);

  expect(loggerMethod).toBeCalledTimes(1);

  const value = storageManager.getValue(testState);

  expect(value).toBe(100);
});

test('storageManager subscribe success', async () => {
  const loggerMethod = jest.spyOn(noopLogger, 'warn');

  const testState = storageManager.register<number>(Symbol('Test'), 100, (a, b) => a === b, []);

  const subscription = storageManager.subscribe(testState, _ => Promise.resolve());

  expect(subscription).not.toBeNull();
  expect(loggerMethod).toBeCalledTimes(0);
});

test('storageManager subscribe not registered', async () => {
  const loggerMethod = jest.spyOn(noopLogger, 'warn');

  const testState = storageManager.register<number>(Symbol('Test'), 100, (a, b) => a === b, []);

  const sm = new StorageManager(defaultStoreDispatcher, noopLogger);

  const subscription = sm.subscribe(testState, _ => Promise.resolve());

  expect(loggerMethod).toBeCalledTimes(1);

  subscription.unsubscribe();
});

test('storageManager persistance write', async () => {
  const mockPersistanceProvider = new Mock<PersistanceProvider<TestValue>>();

  mockPersistanceProvider.setup(m => m.handle(It.IsAny())).returnsAsync();

  const test = storageManager.register<TestValue>(Symbol(), undefined, defaultStoreComparer, [], mockPersistanceProvider.object());

  await storageManager.setValue(test, { id: 1, name: 'test' });

  const value = storageManager.getValue(test);

  expect(value).not.toBeUndefined();

  expect(value!.id).toBe(1);
  expect(value!.name).toBe('test');

  mockPersistanceProvider.verify(m => m.handle(It.IsAny()), Times.Exactly(2));
});

test('storageManager reset undefined', async () => {
  const test = storageManager.register<TestValue>(Symbol(), undefined, defaultStoreComparer, []);

  await storageManager.setValue(test, { id: 1, name: 'test' });
  let value = storageManager.getValue(test);

  expect(value).not.toBeUndefined();
  expect(value!.id).toBe(1);
  expect(value!.name).toBe('test');

  await storageManager.resetValue(test);

  value = storageManager.getValue(test);

  expect(value).toBeUndefined();
});

test('storageManager reset value', async () => {
  const test = storageManager.register<TestValue>(Symbol(), { id: 1, name: 'test' }, defaultStoreComparer, []);

  await storageManager.setValue(test, { id: 2, name: 'hi' });
  let value = storageManager.getValue(test);

  expect(value).not.toBeUndefined();
  expect(value!.id).toBe(2);
  expect(value!.name).toBe('hi');

  await storageManager.resetValue(test);

  value = storageManager.getValue(test);

  expect(value).not.toBeUndefined();
  expect(value!.id).toBe(1);
  expect(value!.name).toBe('test');
});

test('storageManager reset not registered', async () => {
  const loggerMethod = jest.spyOn(noopLogger, 'warn');

  const test = storageManager.register<TestValue>(Symbol(), { id: 1, name: 'test' }, defaultStoreComparer, []);

  await storageManager.setValue(test, { id: 2, name: 'hi' });

  const sm = new StorageManager(defaultStoreDispatcher, noopLogger);

  await sm.resetValue(test);

  const value = storageManager.getValue(test);

  expect(value).not.toBeUndefined();
  expect(value!.id).toBe(2);
  expect(value!.name).toBe('hi');

  expect(loggerMethod).toBeCalledTimes(1);
});
