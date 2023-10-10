# typed-storage

[![npm](https://img.shields.io/npm/v/%40jill64%2Ftyped-storage)](https://npmjs.com/package/@jill64/typed-storage)
[![CI](https://github.com/jill64/typed-storage/actions/workflows/ci.yml/badge.svg)](https://github.com/jill64/typed-storage/actions/workflows/ci.yml)
[![codecov](https://codecov.io/github/jill64/typed-storage/graph/badge.svg?token=6S1ZY4QIPS)](https://codecov.io/github/jill64/typed-storage)

Type-safe localStorage wrapper

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
