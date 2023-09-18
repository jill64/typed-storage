import { array, boolean, number, scanner, string } from 'typescanner'
import { expect, test } from 'vitest'
import { typedStorage } from '../src/index'

test('string', () => {
  const store = typedStorage('string', {
    guard: (x): x is string => typeof x === 'string',
    transformer: { parse: (x) => x, stringify: (x) => x }
  })

  store.remove()

  expect(store.get()).toBe(undefined)
  expect(store.set('value')).toBe(null)
  expect(store.get()).toBe('value')
})

test('null', () => {
  const store = typedStorage('null', {
    guard: (x: unknown): x is null => x === null
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
  expect(store.get()).toEqual(value)
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
