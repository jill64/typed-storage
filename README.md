<!----- BEGIN GHOST DOCS HEADER ----->
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
