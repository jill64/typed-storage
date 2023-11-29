<!----- BEGIN GHOST DOCS HEADER ----->

# typed-storage

[![npm-version](https://img.shields.io/npm/v/@jill64/typed-storage)](https://npmjs.com/package/@jill64/typed-storage) [![npm-license](https://img.shields.io/npm/l/@jill64/typed-storage)](https://npmjs.com/package/@jill64/typed-storage) [![npm-download-month](https://img.shields.io/npm/dm/@jill64/typed-storage)](https://npmjs.com/package/@jill64/typed-storage) [![npm-min-size](https://img.shields.io/bundlephobia/min/@jill64/typed-storage)](https://npmjs.com/package/@jill64/typed-storage) [![ci.yml](https://github.com/jill64/typed-storage/actions/workflows/ci.yml/badge.svg)](https://github.com/jill64/typed-storage/actions/workflows/ci.yml) [![codecov-coverage](https://codecov.io/gh/jill64/typed-storage/graph/badge.svg)](https://codecov.io/gh/jill64/typed-storage)

🗃️ Type-Safe Universal Persistent Storage

## Installation

```sh
npm i @jill64/typed-storage
```

<!----- END GHOST DOCS HEADER ----->

## Example

```ts
import { typedStorage } from '@jill64/typed-storage'
import { json } from '@jill64/typed-storage/serde'

const key = 'localStorageKey'
const value = ['value1', 'value2', 'value3']

const guard = (x: unknown): x is string[] =>
  Array.isArray(x) && x.every((y) => typeof y === 'string')

const store = typedStorage(key, json(guard, []), {
  // Optional
  // Use sessionStorage
  // sessionStorage?: boolean
})

// string[]
const storedValue = store.get()

store.set(value)

const unsubscriber = store.subscribe((newValue) => {
  // called when localStorage value changes
  console.log(newValue)
})

// unsubscribe
unsubscriber()
```
