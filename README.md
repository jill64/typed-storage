<!----- BEGIN GHOST DOCS HEADER ----->

# typed-storage

[![npm-version](https://img.shields.io/npm/v/@jill64/typed-storage)](https://npmjs.com/package/@jill64/typed-storage) [![npm-license](https://img.shields.io/npm/l/@jill64/typed-storage)](https://npmjs.com/package/@jill64/typed-storage) [![npm-download-month](https://img.shields.io/npm/dm/@jill64/typed-storage)](https://npmjs.com/package/@jill64/typed-storage) [![npm-min-size](https://img.shields.io/bundlephobia/min/@jill64/typed-storage)](https://npmjs.com/package/@jill64/typed-storage) [![codecov-coverage](https://codecov.io/gh/jill64/typed-storage/graph/badge.svg)](https://codecov.io/gh/jill64/typed-storage)

Type-safe localStorage wrapper

<!----- END GHOST DOCS HEADER ----->

## Install

```sh
npm i -D @jill64/typed-storage
```

## Example

```ts
const key = 'localStorageKey'
const value = ['value1', 'value2', 'value3']

const store = typedStorage(key, {
  guard: (x: unknown): x is string[] =>
    Array.isArray(x) && x.every((y) => typeof y === 'string')
})

// Remove value from local storage
store.remove()

// Error | null
const result = store.set(value)

// string[] | undefined
const storedValue = store.get()
```

## Options

See [src/types/Options.ts](src/types/Options.ts)
