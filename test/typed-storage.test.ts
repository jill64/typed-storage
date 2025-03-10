import { array, boolean, number, scanner, string } from 'typescanner'
import { expect, test } from 'vitest'
import { devalue, json, string as serdeString } from '../src/serde/index.js'
import { typedStorage } from '../src/typed-storage.js'

test('string', () => {
  const store = typedStorage('string')

  expect(store.get()).toBe('')

  store.set('value')

  expect(store.get()).toBe('value')
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

  const store = typedStorage('object', json(guard, null))

  expect(store.get()).toBe(null)

  store.set(value)

  expect(store.get()).toEqual(value)

  localStorage.setItem('object', JSON.stringify({ foo: 'bar' }))

  expect(store.get()).toEqual(null)
})

test('array', () => {
  const value = ['value1', 'value2', 'value3']

  const guard = (x: unknown): x is string[] =>
    Array.isArray(x) && x.every((y) => typeof y === 'string')

  const store = typedStorage('array', devalue(guard, []))

  expect(store.get()).toEqual([])

  store.set(value)

  expect(store.get()).toEqual(value)
})

test('unavailable typedStorage', () => {
  window = undefined as unknown as Window & typeof globalThis

  const value = 'value'

  const store = typedStorage('unavailable-typedStorage', serdeString)

  expect(store.get()).toBe('')

  store.set(value)

  expect(store.get()).toBe('')

  const localStore = typedStorage('unavailable-typedStorage')

  expect(localStore.get()).toBe('')

  localStore.set(value)

  expect(localStore.get()).toBe('')

  const sessionStore = typedStorage(
    'unavailable-session-typedStorage',
    serdeString,
    {
      sessionStorage: true
    }
  )

  expect(sessionStore.get()).toBe('')

  sessionStore.set(value)

  expect(sessionStore.get()).toBe('')

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

  const objStore = typedStorage(
    'session-typedStorage-test',
    json(guard, null),
    {
      sessionStorage: true
    }
  )

  expect(objStore.get()).toBe(null)

  objStore.set(obj)

  expect(objStore.get()).toEqual(obj)
})
