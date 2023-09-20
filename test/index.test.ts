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
import { passThrough, typedStorage } from '../src/index'

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
})

test('session storage test', () => {
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

  const store = typedStorage('session-storage-test', {
    guard,
    sessionStorage: true,
    defaultValue: null
  })

  store.remove()

  expect(store.get()).toBe(null)
  expect(store.set(value)).toBe(null)
  expect(store.get()).toEqual(null)
})
