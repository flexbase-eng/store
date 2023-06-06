export type SetterCallback<T> = ((currentValue: Readonly<T>) => T) | T;
export type Setter<T> = (setter: SetterCallback<T>) => Promise<void>;
