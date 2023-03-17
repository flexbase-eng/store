import { noopLogger } from '@flexbase/logger';
import { beforeAll, afterEach, vi } from 'vitest';
import { storageManager } from '../src/index';

beforeAll(() => {
  storageManager.logger = noopLogger;
});

afterEach(() => {
  vi.clearAllMocks();
});

export {};
