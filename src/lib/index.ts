import { attempt } from '@jill64/attempt'

type Transformer<T> = {
  parse: (value: string) => T
  stringify: (value: T) => string
}

type TypedStorage = {
  <T>(
    key: string,
    options: {
      guard: (value: unknown) => value is T
      defaultValue: T
      transformer?: Transformer<T>
    }
  ): {
    get: () => T
    set: (value: T) => Error | null
    remove: () => void
  }
  <T>(
    key: string,
    options: {
      guard: (value: unknown) => value is T
      defaultValue?: T
      transformer?: Transformer<T>
    }
  ): {
    get: () => T | undefined
    set: (value: T) => Error | null
    remove: () => void
  }
}

export const typedStorage: TypedStorage = (key, options) => {
  const { guard, defaultValue } = options

  const available = () =>
    typeof window !== 'undefined' && typeof localStorage !== 'undefined'

  const transformer = options.transformer ?? {
    parse: (value: string) => JSON.parse(value),
    stringify: (value: unknown) => JSON.stringify(value)
  }

  return {
    get: () => {
      if (!available()) {
        return defaultValue
      }

      const str = localStorage.getItem(key)

      if (!str) {
        return defaultValue
      }

      const obj = attempt(() => transformer.parse(str))

      if (!guard(obj)) {
        return defaultValue
      }

      return obj
    },
    set: (value) => {
      const str = attempt(() => transformer.stringify(value))

      if (str instanceof Error) {
        return str
      }

      if (available()) {
        localStorage.setItem(key, str)
      }

      return null
    },
    remove: () => {
      if (available()) {
        localStorage.removeItem(key)
      }
    }
  }
}