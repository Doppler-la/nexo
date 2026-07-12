import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminClientsRepository } from '../repositories/adminClientsRepository'
import { UpdateClientPayload } from '../types/client.type'

const QUERY_KEY = ['admin-clients']

export function useAdminClients() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn:  adminClientsRepository.getAll,
  })
}

export function useAdminClient(slug: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, slug],
    queryFn:  () => adminClientsRepository.getBySlug(slug),
    enabled:  !!slug,
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn:   adminClientsRepository.create,
    throwOnError: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useUpdateClient(slug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateClientPayload) => adminClientsRepository.update(slug, payload),
    throwOnError: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, slug] })
    },
  })
}
