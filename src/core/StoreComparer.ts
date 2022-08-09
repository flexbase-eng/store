export type StoreComparer<T> = (newValue: T | undefined, currentValue: T | undefined) => boolean;

export const defaultStoreComparer = <T>(newValue: T | undefined, oldValue: T | undefined) => {
  return newValue === oldValue && Object.is(newValue, oldValue);
};
