export type PublishErrorItem = {
  item_key: string
  msg: string
}
export type PublishSuccessItem = {
  item_key: string
  product_id: string
  product_status: number
}

export type PublishResponse = {
  error: PublishErrorItem[]
  success: PublishSuccessItem[]
}
