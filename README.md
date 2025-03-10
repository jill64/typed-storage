<!----- BEGIN GHOST DOCS HEADER ----->

# @jill64/typed-storage

<!----- BEGIN GHOST DOCS BADGES ----->

<a href="https://npmjs.com/package/@jill64/typed-storage"><img src="https://img.shields.io/npm/v/@jill64/typed-storage" alt="npm-version" /></a> <a href="https://npmjs.com/package/@jill64/typed-storage"><img src="https://img.shields.io/npm/l/@jill64/typed-storage" alt="npm-license" /></a> <a href="https://npmjs.com/package/@jill64/typed-storage"><img src="https://img.shields.io/npm/dm/@jill64/typed-storage" alt="npm-download-month" /></a> <a href="https://npmjs.com/package/@jill64/typed-storage"><img src="https://img.shields.io/bundlephobia/min/@jill64/typed-storage" alt="npm-min-size" /></a>

<!----- END GHOST DOCS BADGES ----->

🗃️ Type-Safe Web Storage API Wrapper

<!----- END GHOST DOCS HEADER ----->

## Installation

```sh
npm i @jill64/typed-storage
```

## Example

See [ts-serde](https://github.com/jill64/ts-serde#readme) for more information on type guard

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

const unsubscriber = store.addListener((newValue) => {
  // called when localStorage value changes
  console.log(newValue)
})

// unsubscribe
unsubscriber()
```

<!----- BEGIN GHOST DOCS FOOTER ----->

## License

[MIT](LICENSE)

<!----- END GHOST DOCS FOOTER ----->
