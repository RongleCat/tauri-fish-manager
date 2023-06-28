import { defineStore } from 'pinia'
import { Key, KeyConfig } from '@/types/common'
import { getConfig, writeConfig } from '@/utils/file'

// interface KeyConfig {
//   keys: Key[]
//   useIndex: number
// }

export const useKeysStore = defineStore('keys-store', {
  state: (): KeyConfig => ({
    keys: [],
    useIndex: 0,
  }),
  getters: {
    currentUsedKey: ({ keys, useIndex }) => keys?.[useIndex],
  },
  actions: {
    async readKeys() {
      const { keys = [], useIndex = 0 } = await getConfig<KeyConfig>()
      this.keys = keys
      this.useIndex = useIndex
    },
    async addKey(key: Key) {
      this.keys.push({ ...key })
      await writeConfig<KeyConfig>(this.$state)
    },
    async editKey(index: number, key: Key) {
      this.keys[index] = { ...key }
      await writeConfig<KeyConfig>(this.$state)
    },
    async deleteKey(index: number) {
      this.keys.splice(index, 1)
      if (index < this.useIndex) {
        this.useIndex -= 1
      }
      await writeConfig<KeyConfig>(this.$state)
    },
    async changeUseIndex(index: number) {
      this.useIndex = index
      await writeConfig<KeyConfig>(this.$state)
    },
  },
})
