import { httpClient } from '@/lib/httpClient'
import { CustomersResponse } from '../types/customer.type';

export const customersRepository = {
  getAll: async () => {
    const { data } = await httpClient.get<CustomersResponse>('/api/customers')
    return data.customers
  },

  link: async (payload: { wooUserId: number; tangoCode: string }) => {
    const { data } = await httpClient.post('/api/customers/link', payload)
    return data
  },
}