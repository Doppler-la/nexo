import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { adminClientDetailRepository } from '../repositories/adminClientDetailRepository'

const QUERY_KEY = ['admin-client-detail']

type PageParams = { limit: number; offset: number }

export function useClientProducts(slug: string, params: PageParams) {
  return useQuery({
    queryKey: [...QUERY_KEY, slug, 'products', params],
    queryFn:  () => adminClientDetailRepository.getProducts(slug, params),
    enabled:  !!slug,
    placeholderData: keepPreviousData,
  })
}

export function useClientStock(slug: string, params: PageParams) {
  return useQuery({
    queryKey: [...QUERY_KEY, slug, 'stock', params],
    queryFn:  () => adminClientDetailRepository.getStock(slug, params),
    enabled:  !!slug,
    placeholderData: keepPreviousData,
  })
}

export function useClientCustomers(slug: string, params: PageParams) {
  return useQuery({
    queryKey: [...QUERY_KEY, slug, 'customers', params],
    queryFn:  () => adminClientDetailRepository.getCustomers(slug, params),
    enabled:  !!slug,
    placeholderData: keepPreviousData,
  })
}

export function useClientOrders(slug: string, params: PageParams) {
  return useQuery({
    queryKey: [...QUERY_KEY, slug, 'orders', params],
    queryFn:  () => adminClientDetailRepository.getOrders(slug, params),
    enabled:  !!slug,
    placeholderData: keepPreviousData,
  })
}

export function useClientSyncLog(slug: string, params: PageParams) {
  return useQuery({
    queryKey: [...QUERY_KEY, slug, 'sync-log', params],
    queryFn:  () => adminClientDetailRepository.getSyncLog(slug, params),
    enabled:  !!slug,
    placeholderData: keepPreviousData,
  })
}
