import { httpClient } from '@/lib/httpClient'
import {
  PaginatedResponse,
  ProductItem,
  StockItem,
  CustomerItem,
  OrderItem,
  SyncLogItem,
} from '../types/clientDetail.type'

type PageParams = { limit?: number; offset?: number }

export const adminClientDetailRepository = {
  getProducts: async (slug: string, params?: PageParams) => {
    const { data } = await httpClient.get<PaginatedResponse<ProductItem>>(
      `/api/admin/clients/${slug}/products`,
      { params },
    )
    return data
  },

  getStock: async (slug: string, params?: PageParams) => {
    const { data } = await httpClient.get<PaginatedResponse<StockItem>>(
      `/api/admin/clients/${slug}/stock`,
      { params },
    )
    return data
  },

  getCustomers: async (slug: string, params?: PageParams) => {
    const { data } = await httpClient.get<PaginatedResponse<CustomerItem>>(
      `/api/admin/clients/${slug}/customers`,
      { params },
    )
    return data
  },

  getOrders: async (slug: string, params?: PageParams) => {
    const { data } = await httpClient.get<PaginatedResponse<OrderItem>>(
      `/api/admin/clients/${slug}/orders`,
      { params },
    )
    return data
  },

  getSyncLog: async (slug: string, params?: PageParams) => {
    const { data } = await httpClient.get<PaginatedResponse<SyncLogItem>>(
      `/api/admin/clients/${slug}/sync-log`,
      { params },
    )
    return data
  },
}
