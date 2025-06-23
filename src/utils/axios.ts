import axios, { AxiosError, type AxiosRequestConfig } from 'axios'
import { getTokenA, getTokenR, setTokenA } from './token'
import { logoutRedirect } from '@/utils/logout'

const baseUrl = import.meta.env.VITE_API_BASE_URL

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 15000,
})

let isRefreshing = false
let refreshQueue: ((token: string) => void)[] = []

instance.interceptors.request.use((config) => {
  const token = getTokenA()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

instance.interceptors.response.use(
  (res) => res.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/api/refreshToken'
    ) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((newToken: string) => {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${newToken}`,
            }
            resolve(instance(originalRequest))
          })
        })
      }

      isRefreshing = true
      try {
        const res = await axios.post('/api/refreshToken', {
          refreshToken: getTokenR(),
        })

        const newToken = res.data.data.accessToken
        setTokenA(newToken)

        refreshQueue.forEach((cb) => cb(newToken))
        refreshQueue = []

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        }
        return instance(originalRequest)
      } catch (err) {
        refreshQueue = []
        logoutRedirect()
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default instance
