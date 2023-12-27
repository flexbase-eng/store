export type StoreType<T> = T extends Store<infer TYPE> ? TYPE : T;

/** Represents a storage state  */
//eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Store<T> {
  /** Gets the key that identifies this store */
  get key(): symbol;
}
