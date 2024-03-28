import { nanoid } from 'nanoid'

export const init = () => {
  /** <key, <id, sub>> */
  const map = new Map<string, Map<string, (event: StorageEvent) => unknown>>()

  if (typeof window !== 'undefined') {
    addEventListener('storage', (event) => {
      const { key } = event
      if (key) {
        map.get(key)?.forEach((sub) => sub(event))
      }
    })
  }

  return (key: string, sub: (event: StorageEvent) => unknown) => {
    const subs = map.get(key)
    const id = nanoid()

    if (subs) {
      subs.set(id, sub)
    } else {
      map.set(key, new Map([[id, sub]]))
    }

    return () => {
      subs?.delete(id)
      if (subs?.size === 0) {
        map.delete(key)
      }
    }
  }
}
