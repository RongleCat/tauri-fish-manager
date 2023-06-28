import { defineStore } from 'pinia'
import { DYProductInfo } from '@/types/common'

type ProductStore = {
  candidateList: DYProductInfo[]
  buildIndex: number
}

export const useProductsStore = defineStore('products-store', {
  state: (): ProductStore => ({
    candidateList: [],
    buildIndex: 0,
  }),
  getters: {
    allProductIds({ candidateList }) {
      return candidateList.map((product: DYProductInfo) => product.product_id)
    },
  },
  actions: {
    addProducts(products: DYProductInfo[]) {
      const temp: DYProductInfo[] = products.filter(
        ({ product_id }) => !this.allProductIds.includes(product_id)
      )
      this.candidateList.push(...temp)
    },
    removeProduct(productId: string) {
      this.candidateList = this.candidateList.filter(({ product_id }) => product_id !== productId)
    },
    updateBuildIndex(index: number) {
      this.buildIndex = index
    },
    clearCandidateList() {
      this.candidateList = []
    },
  },
})
