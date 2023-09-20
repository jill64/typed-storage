import { attempt } from '@jill64/attempt'
import type { Serializer } from './types/Serializer.js'

type TypedStorage = {
  <T>(
    key: string,
    options: {
      guard: (value: unknown) => value is T
      defaultValue: T
      serializer?: Serializer<T>
      sessionStorage?: boolean
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
      serializer?: Serializer<T>
      sessionStorage?: boolean
    }
  ): {
    get: () => T | undefined
    set: (value: T) => Error | null
    remove: () => void
  }
}

export const typedStorage: TypedStorage = (key, options) => {
  const { guard, defaultValue } = options

  const storage = options.sessionStorage ? sessionStorage : localStorage

  const available = () =>
    typeof window !== 'undefined' && typeof storage !== 'undefined'

  const serializer = options.serializer ?? {
    parse: (value: string) => JSON.parse(value),
    stringify: (value: unknown) => JSON.stringify(value)
  }

  return {
    get: () => {
      if (!available()) {
        return defaultValue
      }

      const str = storage.getItem(key)

      if (!str) {
        return defaultValue
      }

      const obj = attempt(() => serializer.parse(str))

      if (!guard(obj)) {
        return defaultValue
      }

      return obj
    },
    set: (value) => {
      const str = attempt(() => serializer.stringify(value))

      if (str instanceof Error) {
        return str
      }

      if (available()) {
        storage.setItem(key, str)
      }

      return null
    },
    remove: () => {
      if (available()) {
        storage.removeItem(key)
      }
    }
  }
}
