export type Serializer<T> = {
  parse: (value: string) => T
  stringify: (value: T) => string
}
