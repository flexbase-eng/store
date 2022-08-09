export type SetterCallback<T> = ((currentValue: Readonly<T> | undefined) => T) | (T | undefined);
export type Setter<T> = (setter: SetterCallback<T>) => Promise<void>;
