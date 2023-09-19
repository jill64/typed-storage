import { Serializer } from '../types/Serializer'

export const passThrough: Serializer<string> = {
  parse: (x) => x,
  stringify: (x) => x
}
