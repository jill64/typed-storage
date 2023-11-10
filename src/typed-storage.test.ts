import {
  array,
  boolean,
  isNull,
  isString,
  number,
  scanner,
  string
} from 'typescanner'
import { expect, test } from 'vitest'
import { passThrough, typedStorage } from './index.js'

test('string', () => {
  const store = typedStorage('string', {
    guard: isString,
    serializer: passThrough
  })

  store.remove()

  expect(store.get()).toBe(undefined)
  expect(store.set('value')).toBe(null)
  expect(store.get()).toBe('value')
})

test('null', () => {
  const store = typedStorage('null', {
    guard: isNull
  })

  store.remove()

  expect(store.get()).toBe(undefined)
  expect(store.set(null)).toBe(null)
  expect(store.get()).toBe(null)
})

test('object', () => {
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

  const store = typedStorage('object', {
    guard
  })

  store.remove()

  expect(store.get()).toBe(undefined)
  expect(store.set(value)).toBe(null)

  localStorage.setItem('object', JSON.stringify({ foo: 'bar' }))

  expect(store.get()).toEqual(undefined)
})

test('array', () => {
  const value = ['value1', 'value2', 'value3']

  const store = typedStorage('array', {
    guard: (x: unknown): x is string[] =>
      Array.isArray(x) && x.every((y) => typeof y === 'string'),
    defaultValue: []
  })

  store.remove()

  expect(store.get()).toEqual([])
  expect(store.set(value)).toBe(null)
  expect(store.get()).toEqual(value)
})

test('invalid transformer', () => {
  const value = 'value'

  const store = typedStorage('invalid-transformer', {
    guard: isString,
    serializer: {
      parse: () => {
        throw new Error('parse error')
      },
      stringify: () => {
        throw new Error('stringify error')
      }
    }
  })

  store.remove()

  expect(store.get()).toEqual(undefined)
  expect(store.set(value)).toBeInstanceOf(Error)
  expect(store.get()).toEqual(undefined)
})

test('unavailable storage', () => {
  // eslint-disable-next-line no-global-assign
  window = undefined as unknown as Window & typeof globalThis

  const value = 'value'

  const store = typedStorage('unavailable-storage', {
    guard: isString
  })

  store.remove()

  expect(store.get()).toBe(undefined)
  expect(store.set(value)).toBe(null)
  expect(store.get()).toBe(undefined)

  // eslint-disable-next-line no-global-assign
  window = {} as unknown as Window & typeof globalThis

  const localStore = typedStorage('unavailable-storage', {
    guard: isString
  })

  localStore.remove()

  expect(localStore.get()).toBe(undefined)
  expect(localStore.set(value)).toBe(null)
  expect(localStore.get()).toBe(undefined)

  const sessionStore = typedStorage('unavailable-session-storage', {
    guard: isString,
    sessionStorage: true
  })

  sessionStore.remove()

  expect(sessionStore.get()).toBe(undefined)
  expect(sessionStore.set(value)).toBe(null)
  expect(sessionStore.get()).toBe(undefined)

  // eslint-disable-next-line no-global-assign
  window = {
    sessionStorage: {
      getItem: () => null,
      setItem: () => null,
      removeItem: () => null
    }
  } as unknown as Window & typeof globalThis

  const obj = {
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

  const objStore = typedStorage('session-storage-test', {
    guard,
    sessionStorage: true,
    defaultValue: null
  })

  objStore.remove()

  expect(objStore.get()).toBe(null)
  expect(objStore.set(obj)).toBe(null)
  expect(objStore.get()).toEqual(obj)
})
