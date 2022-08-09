import { noopLogger } from '@flexbase/logger';
import { storageManager } from '../src/index';

beforeAll(() => {
  storageManager.logger = noopLogger;
});

afterEach(() => {
  jest.clearAllMocks();
});

export {};
