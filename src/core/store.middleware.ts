export type StoreMiddlewareContext<T> = { newValue: T | undefined; currentValue: T | undefined };
export type StoreMiddlewareNext = () => Promise<void>;
export type StoreMiddleware<T> = (context: StoreMiddlewareContext<T>, next: StoreMiddlewareNext) => Promise<void>;
