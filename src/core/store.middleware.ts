export interface StoreMiddlewareContext<T> {
  newValue: T;
  currentValue: T;
}
export type StoreMiddlewareNext = () => Promise<void>;
export type StoreMiddleware<T> = (context: StoreMiddlewareContext<T>, next: StoreMiddlewareNext) => Promise<void>;
