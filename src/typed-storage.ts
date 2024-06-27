import { Serde } from 'ts-serde'
import { string } from 'ts-serde/primitive'
import { init } from './init.js'
import { Options } from './types/Options.js'
import { TypedStorage } from './types/TypedStorage.js'

const addListener = init()

export const typedStorage: {
  <T>(key: string, serde: Serde<T>, options?: Options): TypedStorage<T>
  (key: string, options?: Options): TypedStorage<string>
} = <T>(
  key: string,
  arg?: Serde<T> | Options,
  opts?: Options
): TypedStorage<T> => {
  const isCustomSerde = arg && 'serialize' in arg && 'deserialize' in arg
  const { serialize, deserialize } = (isCustomSerde ? arg : string) as Serde<T>
  const options = isCustomSerde ? opts : arg

  const storage =
    typeof window !== 'undefined'
      ? options?.sessionStorage
        ? sessionStorage
        : localStorage
      : null

  return {
    get: () => deserialize(storage?.getItem(key) ?? ''),
    set: (value: T) => {
      const str = serialize(value)
      storage?.setItem(key, str)
    },
    subscribe: (callback) =>
      addListener(key, ({ newValue }) => callback(deserialize(newValue ?? ''))),
    addListener: (callback) => {
      if (typeof window !== 'undefined') {
        addEventListener('storage', (event) => {
          if (event.key === key) {
            callback(deserialize(event.key))
          }
        })
      }
    }
  }
}
