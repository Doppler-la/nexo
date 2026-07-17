import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { customersRepository } from '../repositories/customersRepository'

const QUERY_KEY = ['customers']

export function useCustomers() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: customersRepository.getMine,
  })
}

export function useLinkCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn:  customersRepository.link,
    throwOnError: false,
    onSuccess: () => {
      // Invalida la query para que la tabla se refresque sola
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useUnlinkCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: customersRepository.unlink,
    throwOnError: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}