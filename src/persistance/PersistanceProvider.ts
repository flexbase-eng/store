import { PersistanceContext } from './PersistanceContext';

export interface PersistanceProvider<T> {
  handle(context: PersistanceContext<T>): Promise<void>;
}
