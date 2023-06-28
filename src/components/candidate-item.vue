<template>
  <div class="candidate-item" :title="hoverTitle">
    <div class="btn-remove" @click="onRemoveItem">
      <el-icon size="36" color="#fff"><icon-ep-remove /></el-icon>
    </div>
    <div class="cover">
      <div class="image">
        <el-image style="width: 100%; height: 100%" :src="product.cover" fit="cover" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { DYProductInfo } from '@/types'
  import IconEpRemove from '~icons/ep/remove'
  import { useProductsStore } from '@/stores'

  const productsStore = useProductsStore()

  interface Props {
    product: DYProductInfo
  }

  const props = defineProps<Props>()

  const hoverTitle = computed(() => {
    const { title, price } = props.product
    return `￥${price / 100} | ${title}`
  })

  const onRemoveItem = () => {
    productsStore.removeProduct(props.product.product_id)
  }
</script>

<style lang="scss" scoped>
  .candidate-item {
    position: relative;
    user-select: none;

    &:hover {
      .btn-remove {
        opacity: 1;
      }
    }
    .cover {
      width: 100%;
      padding-top: 100%;
      position: relative;

      .image {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
      }
    }

    .btn-remove {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      z-index: 2;

      user-select: none;
    }
  }
</style>
