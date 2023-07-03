export { env } from './env'
import { env } from './env'

export const configFile = {
  settings: `settings`,
  keys: `keys`,
}

export const isDev = env !== 'production'
