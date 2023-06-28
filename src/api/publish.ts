import Axios from 'axios'
import md5 from 'md5'
import { useKeysStore } from '@/stores'
import { error } from '@/utils/notice'
import { PublishResponse } from '@/types'

const axios = Axios.create({
  baseURL: 'https://api.goofish.pro/sop',
  headers: { 'Content-Type': 'application/json' },
})

axios.interceptors.response.use(
  ({ data: { status, data, msg } }) => {
    if (status === 200) {
      if (data === 0) {
        return 0
      }
      return data || true
    }

    error(msg)
    return false
  },
  // Do something with response data

  error => {
    error('请求异常，请稍后再试')
    return Promise.reject(error)
  }
)

function sign(data: any, url: string) {
  const key = useKeysStore().currentUsedKey
  const bodyMd5 = md5(JSON.stringify(data))
  const timestamp = Math.round(new Date().valueOf() / 1000)
  const sign = md5(`${key.id},${bodyMd5},${timestamp},${key.secret}`)

  return `${url}?appid=${key.id}&timestamp=${timestamp}&sign=${sign}`
}

export const publishProducts = (data: any): Promise<PublishResponse> => {
  const finalUrl = sign(data, '/product/batchCreate')
  return axios.post(finalUrl, data)
}

export const fetchAllProducts = (data: any = {}) => {
  const finalUrl = sign(data, '/product/list')
  return axios.post(finalUrl, data)
}
