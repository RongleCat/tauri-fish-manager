<template>
  <div class="page h-screen w-screen">
    <div class="content-area">
      <el-button>确定</el-button>
      <template v-if="currentUsedKey">
        id: {{ currentUsedKey.id }} secret: {{ currentUsedKey.secret }}
      </template>
    </div>
    <div class="foot-bar">
      <div class="item">
        <el-button :icon="IconEpKey" circle @click="router.push('/keys')" />
      </div>
      <div class="item">
        <el-button :icon="IconEpSetting" circle @click="router.push('/settings')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import IconEpKey from '~icons/ep/key'
  import IconEpSetting from '~icons/ep/setting'
  import { getConfig } from '@/utils/file'
  import type { Key, KeysConfig } from '@/types/common'

  const router = useRouter()
  const allKeys = ref([] as Key[])
  const currentUseIndex = ref(0)

  const currentUsedKey = computed(() => allKeys.value?.[currentUseIndex.value])

  onMounted(async () => {
    const { keys = [], useIndex = 0 } = await getConfig<KeysConfig>()
    allKeys.value = keys
    currentUseIndex.value = useIndex

    console.log(currentUsedKey.value)
  })
</script>

<style lang="scss" scoped>
  .page {
    display: flex;
    flex-direction: column;
    .content-area {
      flex: 1;
      padding: 20px;
    }

    .foot-bar {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 20px;
      gap: 20px;
      border-top: 1px solid #e4e7ed;
    }
  }
</style>
