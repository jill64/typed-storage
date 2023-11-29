export type TypedStorage<T> = {
  get: () => T
  set: (value: T) => void
  subscribe: (callback: (value: T) => unknown) => () => void
}
