export type PersistanceEvent = 'read' | 'write' | 'reset';

export interface PersistanceContext<T> {
  value: T | undefined;
  event: PersistanceEvent;
  setter: (value: T | undefined) => void;
}
