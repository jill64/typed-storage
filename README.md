# typed-storage

![github-actions-ci](https://github.com/jill64/typed-storage/actions/workflows/ci.yml/badge.svg)

Type-safe localStorage wrapper

## Install

```sh
npm i -D @jill64/typed-storage
```

## Example

```js
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

| Name         | Type                                                       | Description                                                                  |
| ------------ | ---------------------------------------------------------- | ---------------------------------------------------------------------------- |
| guard        | `(x: unknown): x is T => boolean`                          | A type guard function to use when retrieving values from storage             |
| defaultValue | `T `                                                       | Default value when there is no value in storage (default: `undefined`)       |
| transformer  | `{ parse: (x: string) => T, stringify: (x: T) => string }` | Conversion function when getting/setting values in storage (default: `JSON`) |
