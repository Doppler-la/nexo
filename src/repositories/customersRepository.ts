import { httpClient } from '@/lib/httpClient'
import { CustomersResponse } from '../types/customer.type';

export const customersRepository = {
  getMine: async () => {
    const { data } = await httpClient.get<CustomersResponse>('/api/customers/mine')
    return data.customers
  },

  link: async (payload: { wooUserId: number; tangoCode: string }) => {
    const { data } = await httpClient.post('/api/customers/link', payload)
    return data
  },

  unlink: async (wooUserId: number) => {
    const { data } = await httpClient.delete(`/api/customers/${wooUserId}`)
    return data
  },
}