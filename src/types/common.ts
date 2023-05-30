export type Key = {
  id: string
  secret: string
  name: string
}

export type KeysConfig = {
  keys?: Key[]
  useIndex: number
}
