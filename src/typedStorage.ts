import { attempt } from '@jill64/attempt'
import { Options } from './types/Options.js'

type TypedStorage = {
  <T>(
    key: string,
    options: Options<T> & Required<Pick<Options<T>, 'defaultValue'>>
  ): {
    get: () => T
    set: (value: T) => Error | null
    remove: () => void
  }
  <T>(
    key: string,
    options: Options<T>
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
