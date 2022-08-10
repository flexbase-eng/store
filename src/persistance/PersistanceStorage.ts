export interface PersistanceStorage {
  setItem(key: string, value: string): void | Promise<void>;
  mergeItem?(key: string, value: string): Promise<void>;
  getItem(key: string): null | string | Promise<string>;
  removeItem(key: string): void | Promise<void>;
}
