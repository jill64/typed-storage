export type TypedStorage<T> = {
  get: () => T
  set: (value: T) => void
  /** @deprecated Use addListener instead */
  subscribe: (callback: (value: T) => unknown) => () => void
  addListener: (callback: (value: T) => unknown) => void
}
