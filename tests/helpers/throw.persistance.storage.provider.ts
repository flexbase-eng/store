import { PersistanceContext, PersistanceProvider } from '../../src';

export class ThrowPersistanceStorageProvider<T> implements PersistanceProvider<T> {
  handle(context: PersistanceContext<T>): Promise<void> {
    throw new Error('ThrowPersistanceStorageProvider handle');
  }
}
