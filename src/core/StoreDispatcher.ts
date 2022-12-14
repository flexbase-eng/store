import { StoreMiddleware, StoreMiddlewareContext } from './StoreMiddleware';

/** Represents a store middleware dispatcher */
export interface StoreDispatcher {
  /**
   * Handles dispatching the store middleware
   * @param context The context sent to each middleware
   * @param middleware The middleware array to be executed
   */
  dispatch<T>(context: StoreMiddlewareContext<T>, middleware: StoreMiddleware<T>[]): Promise<void>;
}

class DefaultStoreDispatcher implements StoreDispatcher {
  dispatch<T>(context: StoreMiddlewareContext<T>, middleware: StoreMiddleware<T>[]): Promise<void> {
    return this.invokeMiddleware(context, middleware);
  }

  private invokeMiddleware<T>(context: StoreMiddlewareContext<T>, middleware: StoreMiddleware<T>[]): Promise<void> {
    if (!middleware.length) return Promise.resolve();

    const mw = middleware[0];

    return mw(context, () => this.invokeMiddleware(context, middleware.slice(1)));
  }
}

/** Represents a global default store dispatcher instance */
export const defaultStoreDispatcher = new DefaultStoreDispatcher();
