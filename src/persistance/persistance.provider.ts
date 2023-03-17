import { PersistanceContext } from './persistance.context';

export interface PersistanceProvider<T> {
  handle(context: PersistanceContext<T>): Promise<void>;
}
