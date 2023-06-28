export type Key = {
  id: string
  secret: string
  name: string
  typeId: string
  classifyId: string
  categoryId: string
  districtId: string
}

export type KeyConfig = {
  keys?: Key[]
  useIndex: number
}

export type PageInfo = {
  total_page: number
  total_count: number
  size: number
  page: number
}

export type QueryParams = {
  size: number
  page: number
}

// 抖音分类信息
export type DYProductCategoryInfo = {
  big: string
  first: string
  second: string
  third: string
}

// 抖音商品信息
export type DYProductInfo = {
  price: number
  stock: number
  title: string
  cover: string
  product_id: string
  category: DYProductCategoryInfo
}

// 抖音商品信息
export type OriginSkuItem = {
  parent: string
  name: string
}

// 抖音商品信息
export type SkuInfo = {
  price: number
  stock: number
  outer_id: string
  sku_text: string
}

// 闲鱼上传商品信息
export type ProductInfo = {
  price: number
  stock: number
  title: string
  images: string[]
  sku_items?: SkuInfo[]
  desc: string
  district_id: number // 发货地区ID
  item_biz_type: number // 商品类型ID
  sp_biz_type: number // 商品分类ID
  channel_cat_id: string // 商品类目ID
  item_key: string // 批次字符串
}
