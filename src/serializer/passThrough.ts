import { Serializer } from '../types/Serializer.js'

export const passThrough: Serializer<string> = {
  parse: (x) => x,
  stringify: (x) => x
}
