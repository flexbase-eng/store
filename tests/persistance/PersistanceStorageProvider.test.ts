import { PersistanceStorage, PersistanceStorageProvider } from '../../src/index';
import { It, Mock, Times } from 'moq.ts';
import { noopLogger } from '@flexbase/logger';

const testStoreage1 = { test: 'test' };
const testStoreage2 = [
  { id: 1, value: 'one' },
  { id: 2, value: 'two' },
];

test.each([testStoreage1, testStoreage2, null, undefined, 1])('PersistanceStorageProvider read', async storageItem => {
  const mockStorage = new Mock<PersistanceStorage>();
  const mockSetter = jest.fn((value: any | undefined) => {});
  const loggerMethod = jest.spyOn(noopLogger, 'warn');

  mockStorage.setup(m => m.getItem(It.IsAny())).returnsAsync(JSON.stringify(storageItem));

  const provider = new PersistanceStorageProvider('test', mockStorage.object(), noopLogger);

  await provider.handle({ value: undefined, event: 'read', setter: mockSetter });

  expect(loggerMethod).toBeCalledTimes(0);

  mockStorage.verify(m => m.getItem(It.IsAny()), Times.Once());
  expect(mockSetter).toBeCalledTimes(1);
  expect(mockSetter).toBeCalledWith(storageItem);
});

test('PersistanceStorageProvider read exception', async () => {
  const mockStorage = new Mock<PersistanceStorage>();
  const mockSetter = jest.fn((value: any | undefined) => {});
  const loggerMethod = jest.spyOn(noopLogger, 'warn');

  mockStorage.setup(m => m.getItem(It.IsAny())).throwsAsync(Error());

  const provider = new PersistanceStorageProvider('test', mockStorage.object(), noopLogger);

  await provider.handle({ value: undefined, event: 'read', setter: mockSetter });

  expect(loggerMethod).toBeCalledTimes(1);

  mockStorage.verify(m => m.getItem(It.IsAny()), Times.Once());
  expect(mockSetter).toBeCalledTimes(0);
});

test('PersistanceStorageProvider read json exception', async () => {
  const mockStorage = new Mock<PersistanceStorage>();
  const mockSetter = jest.fn((value: any | undefined) => {});
  const loggerMethod = jest.spyOn(noopLogger, 'warn');

  mockStorage.setup(m => m.getItem(It.IsAny())).returnsAsync('!');

  const provider = new PersistanceStorageProvider('test', mockStorage.object(), noopLogger);

  await provider.handle({ value: undefined, event: 'read', setter: mockSetter });

  expect(loggerMethod).toBeCalledTimes(1);

  mockStorage.verify(m => m.getItem(It.IsAny()), Times.Once());
  expect(mockSetter).toBeCalledTimes(1);
  expect(mockSetter).toBeCalledWith(undefined);
});

test.each([testStoreage1, testStoreage2, 1])('PersistanceStorageProvider write', async storageItem => {
  const mockStorage = new Mock<PersistanceStorage>();
  const loggerMethod = jest.spyOn(noopLogger, 'warn');
  const mockSetter = jest.fn((value: any | undefined) => {});

  mockStorage.setup(m => m.setItem(It.IsAny(), It.IsAny())).returnsAsync();

  const provider = new PersistanceStorageProvider('test', mockStorage.object(), noopLogger);

  await provider.handle({ event: 'write', value: storageItem, setter: mockSetter });

  expect(loggerMethod).toBeCalledTimes(0);

  mockStorage.verify(m => m.setItem(It.IsAny<string>(), It.IsAny()), Times.Once());
  expect(mockSetter).toBeCalledTimes(0);
});

test('PersistanceStorageProvider write undefined', async () => {
  const mockStorage = new Mock<PersistanceStorage>();
  const loggerMethod = jest.spyOn(noopLogger, 'warn');
  const mockSetter = jest.fn((value: any | undefined) => {});

  mockStorage.setup(m => m.removeItem(It.IsAny())).returnsAsync();

  const provider = new PersistanceStorageProvider('test', mockStorage.object(), noopLogger);

  await provider.handle({ event: 'write', value: undefined, setter: mockSetter });

  expect(loggerMethod).toBeCalledTimes(0);

  mockStorage.verify(m => m.removeItem(It.IsAny()), Times.Once());
  expect(mockSetter).toBeCalledTimes(0);
});

test.each([testStoreage1, testStoreage2, 1])('PersistanceStorageProvider write merge', async storageItem => {
  const mockStorage = new Mock<PersistanceStorage>();
  const loggerMethod = jest.spyOn(noopLogger, 'warn');
  const mockSetter = jest.fn((value: any | undefined) => {});

  mockStorage.setup(m => m.mergeItem!(It.IsAny(), It.IsAny())).returnsAsync();

  const provider = new PersistanceStorageProvider('test', mockStorage.object(), noopLogger);

  await provider.handle({ event: 'write', value: storageItem, setter: mockSetter });

  expect(loggerMethod).toBeCalledTimes(0);

  mockStorage.verify(m => m.mergeItem!(It.IsAny<string>(), It.IsAny()), Times.Once());
  expect(mockSetter).toBeCalledTimes(0);
});

test.each([testStoreage1, testStoreage2, 1])('PersistanceStorageProvider write exception', async storageItem => {
  const mockStorage = new Mock<PersistanceStorage>();
  const loggerMethod = jest.spyOn(noopLogger, 'warn');
  const mockSetter = jest.fn((value: any | undefined) => {});

  mockStorage.setup(m => m.setItem(It.IsAny(), It.IsAny())).throwsAsync(Error());

  const provider = new PersistanceStorageProvider('test', mockStorage.object(), noopLogger);

  await provider.handle({ event: 'write', value: storageItem, setter: mockSetter });

  expect(loggerMethod).toBeCalledTimes(1);

  mockStorage.verify(m => m.setItem(It.IsAny<string>(), It.IsAny()), Times.Once());
  expect(mockSetter).toBeCalledTimes(0);
});

test('PersistanceStorageProvider reset', async () => {
  const mockStorage = new Mock<PersistanceStorage>();
  const loggerMethod = jest.spyOn(noopLogger, 'warn');
  const mockSetter = jest.fn((value: any | undefined) => {});

  mockStorage.setup(m => m.removeItem(It.IsAny())).returnsAsync();

  const provider = new PersistanceStorageProvider('test', mockStorage.object(), noopLogger);

  await provider.handle({ event: 'reset', value: undefined, setter: mockSetter });

  expect(loggerMethod).toBeCalledTimes(0);

  mockStorage.verify(m => m.removeItem(It.IsAny<string>()), Times.Once());
  expect(mockSetter).toBeCalledTimes(0);
});

test('PersistanceStorageProvider reset with value', async () => {
  const mockStorage = new Mock<PersistanceStorage>();
  const loggerMethod = jest.spyOn(noopLogger, 'warn');
  const mockSetter = jest.fn((value: any | undefined) => {});

  mockStorage.setup(m => m.setItem(It.IsAny(), It.IsAny())).returnsAsync();

  const provider = new PersistanceStorageProvider('test', mockStorage.object(), noopLogger);

  await provider.handle({ event: 'reset', value: 1, setter: mockSetter });

  expect(loggerMethod).toBeCalledTimes(0);

  mockStorage.verify(m => m.setItem(It.IsAny(), It.IsAny()), Times.Once());
  expect(mockSetter).toBeCalledTimes(0);
});

test('PersistanceStorageProvider reset exception', async () => {
  const mockStorage = new Mock<PersistanceStorage>();
  const loggerMethod = jest.spyOn(noopLogger, 'warn');
  const mockSetter = jest.fn((value: any | undefined) => {});

  mockStorage.setup(m => m.removeItem(It.IsAny())).throwsAsync(Error());

  const provider = new PersistanceStorageProvider('test', mockStorage.object(), noopLogger);

  await provider.handle({ event: 'reset', value: undefined, setter: mockSetter });

  expect(loggerMethod).toBeCalledTimes(1);

  mockStorage.verify(m => m.removeItem(It.IsAny<string>()), Times.Once());
  expect(mockSetter).toBeCalledTimes(0);
});
