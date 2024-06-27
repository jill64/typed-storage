export type TypedStorage<T> = {
  get: () => T
  set: (value: T) => void
  addListener: (callback: (event: StorageEvent) => unknown) => () => void
}
