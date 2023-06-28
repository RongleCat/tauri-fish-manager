import axios from 'axios'

export const query = async url => {
  const {
    data: { code, data },
  } = await axios(url)
  if (code !== 0) {
    return Promise.reject()
  }
  return data
}

export const fetchProductSkuInfo = async productId => {
  const {
    data: { code, data },
  } = await axios(`https://api-service.chanxuan.com/v1/product/detail/sku?product_id=${productId}`)
  if (code !== 0) {
    return Promise.reject()
  }
  return data
}
