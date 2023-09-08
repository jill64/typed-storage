import { typedStorage } from '../../../lib/src/index.js'
import { scanner, string, number, array, boolean } from 'typescanner'
import isEqual from 'lodash/isEqual.js'

const test = <T>(
  store: {
    get: () => T | undefined
    set: (value: T) => Error | null
    remove: () => void
  },
  value: T,
  defaultValue?: T
) => {
  store.remove()

  if (!isEqual(store.get(), defaultValue)) {
    return false
  }

  if (store.set(value)) {
    return false
  }

  return isEqual(store.get(), value)
}

export const tests: ((id: string) => boolean)[] = [
  (id) => {
    const store = typedStorage(id, {
      guard: (x): x is string => typeof x === 'string',
      transformer: { parse: (x) => x, stringify: (x) => x }
    })

    return test(store, 'value')
  },
  (id) => {
    const store = typedStorage(id, {
      guard: (x: unknown): x is null => x === null
    })

    return test(store, null)
  },
  (id) => {
    const value = {
      foo: 'bar',
      baz: 1,
      qux: true,
      quux: [1, 2, 3]
    }

    const guard = scanner({
      foo: string,
      baz: number,
      qux: boolean,
      quux: array(number)
    })

    const store = typedStorage(id, {
      guard
    })

    return test(store, value)
  },
  (id) => {
    const value = ['value1', 'value2', 'value3']

    const store = typedStorage(id, {
      guard: (x: unknown): x is string[] =>
        Array.isArray(x) && x.every((y) => typeof y === 'string'),
      defaultValue: []
    })

    return test(store, value, [])
  }
]
