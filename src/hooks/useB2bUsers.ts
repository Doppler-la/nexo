import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { b2bUsersRepository as repo } from '../repositories/b2bUsersRepository'
import { B2bStatus, CreateB2bUserPayload, UpdateB2bUserPayload } from '../types/b2bUser.type'

const KEY = (clientId?: number) => ['b2b-users', clientId ?? 'mine']

export function useB2bUsers(clientId?: number, status?: B2bStatus) {
  return useQuery({
    queryKey: [...KEY(clientId), status ?? 'all'],
    queryFn:  () => repo.list(clientId, status),
  })
}

// Todas las mutaciones refrescan todas las pestañas (contador de pendientes incluido)
function useB2bMutation<V>(clientId: number | undefined, fn: (v: V) => Promise<unknown>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn:   fn,
    throwOnError: false,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY(clientId) }),
    // 409 not_pending / not_editable: la lista quedó vieja
    onError: () => queryClient.invalidateQueries({ queryKey: KEY(clientId) }),
  })
}

export const useApproveB2bUser = (c?: number) =>
  useB2bMutation(c, (v: { id: number; tangoCode?: string }) => repo.approve(c, v.id, v.tangoCode))

export const useRejectB2bUser = (c?: number) =>
  useB2bMutation(c, (v: { id: number; reason?: string }) => repo.reject(c, v.id, v.reason))

export const useUpdateB2bUser = (c?: number) =>
  useB2bMutation(c, (v: { id: number; payload: UpdateB2bUserPayload }) => repo.update(c, v.id, v.payload))

export const useCreateB2bUser = (c?: number) =>
  useB2bMutation(c, (payload: CreateB2bUserPayload) => repo.create(c, payload))

export const useResetB2bPassword = (c?: number) =>
  useB2bMutation(c, (v: { id: number; password: string }) => repo.resetPassword(c, v.id, v.password))
