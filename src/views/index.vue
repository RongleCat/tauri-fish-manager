<template>
  <div class="page h-screen w-screen">
    <div v-show="uploading" class="loading-layer">
      <div class="el-loading-spinner">
        <svg class="circular" viewBox="0 0 50 50">
          <circle class="path" cx="25" cy="25" r="20" fill="none" />
        </svg>
      </div>
      {{ loadingText }}
    </div>
    <div class="content-area">
      <div class="api-input">
        <div class="right-area">
          <div class="current-key" @click="router.push('/keys')">
            <el-icon :size="16">
              <icon-ep-key />
            </el-icon>
            {{ currentUsedKey }}
          </div>
          <!-- <div class="btn-box">
            <div class="item">
              <el-button :icon="IconEpKey" circle @click="router.push('/keys')" />
            </div>
            <div class="item">
              <el-button :icon="IconEpSetting" circle @click="router.push('/settings')" />
            </div>
          </div> -->
        </div>
        <el-input v-model.trim="apiLink" placeholder="请输入API地址">
          <template #append>
            <el-button :icon="IconEpSearch" @click="urlParse" />
          </template>
        </el-input>
      </div>
      <div class="table-area">
        <div class="left-area">
          <el-table
            ref="multipleTableRef"
            empty-text="暂无商品"
            border
            :data="productList"
            stripe
            style="width: 100%"
            :max-height="tableMaxHeight"
            :height="tableMaxHeight"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="40" />
            <el-table-column prop="cover" label="商品主图" width="100">
              <template #default="scope">
                <el-image
                  style="width: 100px; height: 100px"
                  :src="scope.row.cover"
                  :preview-src-list="[scope.row.cover]"
                  :initial-index="0"
                  :z-index="1000000"
                  hide-on-click-modal
                  preview-teleported
                  fit="cover"
                />
              </template>
            </el-table-column>
            <el-table-column prop="title" label="商品标题" />
            <el-table-column prop="price" label="商品价格" width="100">
              <template #default="scope"> ￥{{ scope.row.price / 100 }} </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="candidate-box">
          <div class="title">
            候选列表
            <div class="total">
              已选 <span>{{ productsStore.candidateList.length }}</span> 款商品
            </div>
          </div>
          <div class="list">
            <candidate-item
              v-for="item in productsStore.candidateList"
              :key="item.product_id"
              :product="item"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bar">
      <div v-if="!pageInfo.total_page" class="scope" />
      <el-pagination
        v-model:page-size="allParams.size"
        background
        layout="prev, pager, next, sizes"
        :page-sizes="[20, 50, 100, 200]"
        :page-count="pageInfo.total_page"
        :default-page-size="allParams.size"
        @current-change="pageChange"
      />
      <div class="right-box">
        <!-- <el-button type="primary" @click="showPublishReport = true"> 打开报告 </el-button>
        <el-button type="primary" @click="testAPI"> 测试接口 </el-button> -->
        <el-tooltip class="box-item" effect="dark" content="添加到候选列表" placement="top-end">
          <el-button :disabled="!multipleSelection.length" type="primary" @click="addToCandidate">
            添加候选
          </el-button>
        </el-tooltip>

        <el-button
          :disabled="!productsStore.candidateList.length"
          type="success"
          @click="startUploadProduct"
          >开始上传</el-button
        >
      </div>
    </div>

    <el-dialog v-model="showPublishReport" title="商品上传报告" width="90%" @closed="onReportClose">
      <div class="statistics">
        共上传 <span class="blue">{{ productsStore.candidateList.length }}</span> 款商品，<span
          class="green"
          >{{ productsStore.candidateList.length - errorItems.length }}</span
        >
        款成功，<span class="red">{{ errorItems.length }}</span> 款失败
      </div>

      <el-table
        v-if="errorProductList.length"
        empty-text="暂无商品"
        border
        :data="errorProductList"
        stripe
        style="width: 100%"
        :max-height="250"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column prop="cover" label="商品主图" width="100">
          <template #default="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.cover"
              :preview-src-list="[scope.row.cover]"
              :initial-index="0"
              :z-index="1000000"
              hide-on-click-modal
              preview-teleported
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="商品标题" />
        <el-table-column prop="price" label="商品价格" width="100">
          <template #default="scope"> ￥{{ scope.row.price / 100 }} </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPublishReport = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import IconEpKey from '~icons/ep/key'
  import type { ElTable } from 'element-plus'
  import { ElMessageBox } from 'element-plus'
  import IconEpSearch from '~icons/ep/search'
  import { useKeysStore, useProductsStore } from '@/stores'
  import { parse, stringify } from 'qs'
  import { error, warring } from '@/utils'
  import { query } from '@/api/common'
  import type { PageInfo, QueryParams, DYProductInfo, ProductInfo, PublishErrorItem } from '@/types'
  import CandidateItem from '@/components/candidate-item.vue'
  import { batchBuildProduct } from '@/utils/upload'
  import { fetchAllProducts, publishProducts } from '@/api/publish'

  const keysStore = useKeysStore()
  const productsStore = useProductsStore()

  const router = useRouter()

  const currentUsedKey = computed(() => {
    const key = keysStore.currentUsedKey
    return key ? `${key.name}: ${key.id}` : '暂无正在使用的店铺，点击选择'
  })

  const loadingText = computed(() => {
    const allProducts = productsStore.candidateList
    const buildIndex = productsStore.buildIndex
    if (buildIndex === allProducts.length) {
      return '正在上传商品'
    }
    return `正在处理第 ${buildIndex} 个商品`
  })

  const errorProductList = computed(() => {
    const errorProductIds = errorItems.value.map(({ item_key }) => item_key)
    return productsStore.candidateList.filter(({ product_id }) =>
      errorProductIds.includes(product_id)
    )
  })

  const tableMaxHeight = ref(0)
  const uploading = ref(false)
  const showPublishReport = ref(false)

  const apiLink = ref('')
  const baseUrl = ref('')
  const productList = ref<DYProductInfo[]>([])
  const errorItems = ref<PublishErrorItem[]>([])

  const allParams = reactive<QueryParams>({} as QueryParams)
  const pageInfo = reactive<PageInfo>({} as PageInfo)

  // 多选
  const multipleTableRef = ref<InstanceType<typeof ElTable>>()
  const multipleSelection = ref<DYProductInfo[]>([])

  onMounted(() => {
    getTableMaxHeight()
  })

  const urlParse = () => {
    if (!apiLink.value) {
      error('请输入API链接')
      return
    }
    const splitArray = apiLink.value.split('?')
    const params = splitArray[1]
    baseUrl.value = splitArray[0]
    const parsedParams = parse(params)
    Object.assign(allParams, parse(params))

    allParams.size = +parsedParams.size
  }

  const testAPI = async () => {
    const res = await fetchAllProducts()

    ElMessageBox.alert(JSON.stringify(res))
  }

  const queryList = async () => {
    try {
      const { list, page_info } = await query(`${baseUrl.value}?${stringify(allParams)}`)
      productList.value = list
      Object.assign(pageInfo, page_info)
    } catch (error) {
      //
    }
  }

  window.onresize = () => {
    getTableMaxHeight()
  }

  const pageChange = async page => {
    console.log(page)
    allParams.page = page
  }

  const handleSelectionChange = (productList: DYProductInfo[]) => {
    multipleSelection.value = productList
  }

  const getTableMaxHeight = () => {
    const { clientHeight } = document.body
    tableMaxHeight.value = clientHeight - 74 - 32 - 10
  }

  const startUploadProduct = async () => {
    uploading.value = true
    const parsedProducts = await batchBuildProduct()
    await batchPublishProducts(parsedProducts)
    uploading.value = false
  }

  const addToCandidate = () => {
    if (!multipleSelection.value.length) {
      warring('请在左侧选择商品')
      return
    }

    productsStore.addProducts(multipleSelection.value)
  }

  const singlePublishProducts = async (products: ProductInfo[]) => {
    const { error = [] } = await publishProducts(products)
    return error
  }

  const batchPublishProducts = async (allProducts: ProductInfo[]) => {
    const size = 10
    const queueCount = Math.ceil(allProducts.length / size)
    const errorProducts: PublishErrorItem[] = []
    console.log(queueCount)

    for (let i = 0; i < queueCount; i++) {
      const targetProduct = allProducts.slice(i * size, (i + 1) * size)

      const errorList = await singlePublishProducts(targetProduct)
      errorProducts.push(...errorList)
    }
    errorItems.value = errorProducts

    showPublishReport.value = true
  }

  const onReportClose = () => {
    productsStore.clearCandidateList()
    multipleSelection.value = []
    productList.value = []
  }

  watch(allParams, () => {
    queryList()
  })
</script>

<style lang="scss" scoped>
  .page {
    display: flex;
    flex-direction: column;

    * {
      box-sizing: border-box;
    }

    .content-area {
      flex: 1;
      display: flex;
      padding: 0 10px;
      flex-direction: column;
      padding-top: 10px;
      overflow: hidden;
    }

    .footer-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #ebeef5;
      padding: 10px;
      min-height: 54px;
    }
  }

  .table-area {
    flex: 1;
    width: 100%;
    max-height: 100%;
    padding-bottom: 10px;
    padding-top: 10px;
    display: flex;
    gap: 10px;
    overflow: hidden;

    .left-area {
      flex: 1;
    }

    .candidate-box {
      width: 400px;
      border: 1px solid #ebeef5;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .title {
        font-size: 14px;
        font-weight: 700;
        color: #909399;
        padding: 8px;
        border-bottom: 1px solid #ebeef5;
        line-height: 22px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .total {
          font-weight: normal;
          font-size: 12px;

          span {
            color: #09f;
            font-weight: bold;
          }
        }
      }
      .list {
        padding: 10px;
        flex: 1;
        overflow-y: auto;

        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-auto-rows: 119px;
        gap: 10px;

        &:empty {
          display: flex;
          justify-content: center;
          &::after {
            content: '暂无候选商品';
            font-size: 16px;
            color: #ccc;
            line-height: 200px;
          }
        }
      }
    }
  }

  .api-input {
    display: flex;
    align-items: center;
    .right-area {
      display: flex;
      align-items: center;
      white-space: nowrap;
      .current-key {
        font-size: 14px;
        color: #606266;
        padding: 0 10px;
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          color: #09f;
        }
      }
    }
  }

  .loading-layer {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 200;
    background-color: rgba(255, 255, 255, 0.7);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--el-color-primary);
    gap: 20px;
    .el-loading-spinner {
      .circular {
        display: inline;
        height: 50px;
        width: 50px;
        animation: loading-rotate 2s linear infinite;
      }
      .path {
        animation: loading-dash 1.5s ease-in-out infinite;
        stroke-dasharray: 90, 150;
        stroke-dashoffset: 0;
        stroke-width: 2;
        stroke: var(--el-color-primary);
        stroke-linecap: round;
      }
    }
  }

  @keyframes loading-dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -40px;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -120px;
    }
  }

  @keyframes loading-rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  .statistics {
    font-size: 16px;
    color: #333;
    padding-bottom: 20px;

    span {
      font-weight: bold;

      &.blue {
        color: var(--el-color-primary);
      }

      &.green {
        color: var(--el-color-success);
      }
      &.red {
        color: var(--el-color-error);
      }
    }
  }
</style>
