export type StoreComparer<T> = (newValue: T, currentValue: T) => boolean;

export const defaultStoreComparer = <T>(newValue: T, oldValue: T) => {
  return newValue === oldValue && Object.is(newValue, oldValue);
};
