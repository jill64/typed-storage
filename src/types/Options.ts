import { Serializer } from './Serializer.js'

export type Options<T> = {
  /**
   * A type guard function to use when retrieving values from storage
   */
  guard: (value: unknown) => value is T

  /**
   * A default value to use when no value is found in storage
   * @default undefined
   */
  defaultValue?: T

  /**
   * Conversion function when getting/setting values in storage
   * @default JSON
   */
  serializer?: Serializer<T>

  /**
   * Whether to use sessionStorage instead of localStorage
   * @default false
   */
  sessionStorage?: boolean
}
