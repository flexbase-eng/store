/** Represents a storage state  */
//eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Store<T> {
  /** Gets the key that identifies this store */
  get key(): symbol;
}
