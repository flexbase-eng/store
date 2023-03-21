import { PersistanceContext } from './persistance.context.js';

export interface PersistanceProvider<T> {
  handle(context: PersistanceContext<T>): Promise<void>;
}
