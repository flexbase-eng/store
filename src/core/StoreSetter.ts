export type SetterCallback<T> = ((currentValue: Readonly<T> | undefined) => T | undefined) | (T | undefined);
export type Setter<T> = (setter: SetterCallback<T>) => Promise<void>;
