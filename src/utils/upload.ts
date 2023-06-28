import type { ProductInfo, DYProductInfo, Key, SkuInfo, OriginSkuItem } from '@/types'
import { useKeysStore, useProductsStore } from '@/stores'
import { error } from '@/utils'
import { fetchProductSkuInfo } from '@/api/common'

let currentUsedKey: Key

const skuBuilder = ({ specs, skus }): SkuInfo[] => {
  const skuList: SkuInfo[] = []

  if (specs.length > 2) {
    return skuList
  }

  const allItem: { [key: string]: OriginSkuItem } = {}

  specs.forEach(({ spec_items }, index) => {
    const groupName = `规格${'一二'[index]}`
    spec_items.forEach(({ id, name }) => {
      allItem[id] = { parent: groupName, name }
    })
  })

  return Object.keys(skus).map(ids => {
    const target = skus[ids]
    const idlist = ids.split(';')
    const sku_text = idlist
      .map(id => {
        const { parent, name } = allItem[id]
        const finalName = name.length > 20 ? `${name.substring(0, 17)}...` : name
        return `${parent}:${finalName}`
      })
      .join(';')
    return {
      price: target.price,
      stock: 2500,
      sku_text,
      outer_id: ids,
    }
  })
}

const singleBuildProduct = async (product: DYProductInfo): Promise<ProductInfo> => {
  const skuInfo = await fetchProductSkuInfo(product.product_id)

  const { big, first, second, third } = product.category
  const desc = [big, first, second, third].join(' ')

  return {
    title: product.title.substring(0, 30),
    price: product.price,
    stock: product.stock || 9999,
    desc: `${product.title} ${desc}`,
    sku_items: skuBuilder(skuInfo),
    images: [product.cover.split('?')[0]],
    item_key: product.product_id,
    item_biz_type: +currentUsedKey.typeId,
    sp_biz_type: +currentUsedKey.classifyId,
    channel_cat_id: currentUsedKey.categoryId,
    district_id: +currentUsedKey.districtId,
  }
}

export const batchBuildProduct = async (): Promise<ProductInfo[]> => {
  currentUsedKey = useKeysStore().currentUsedKey
  const productsStore = useProductsStore()
  const candidateList: DYProductInfo[] = productsStore.candidateList
  const result: ProductInfo[] = []

  if (!candidateList.length) {
    error('请先添加候选商品')
    return
  }

  for (let i = 0; i < candidateList.length; i++) {
    const product = candidateList[i]

    result.push(await singleBuildProduct(product))
    productsStore.updateBuildIndex(i + 1)
  }

  return result
}
