import { defineStore } from 'pinia'
import { Key, KeysConfig } from '@/types/common'
import { getConfig } from '@/utils/file'

interface KeysState {
  keyList: Key[]
  useIndex: number
}

export const useKeysStore = defineStore('keys-store', {
  state: (): KeysState => ({
    keyList: [],
    useIndex: 0,
  }),
  getters: {
    currentUsedKey: ({ keyList, useIndex }) => keyList?.[useIndex],
  },
  actions: {
    async readKeyList() {
      const { keys = [], useIndex = 0 } = await getConfig<KeysConfig>()
      this.keyList = keys
      this.useIndex = useIndex
    },
  },
})
