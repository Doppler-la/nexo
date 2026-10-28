export type B2bStatus = 'pending' | 'approved' | 'rejected'

export interface B2bUser {
  id: number
  clientId: number
  email: string
  mustChangePassword: boolean
  name: string
  razonSocial: string | null
  cuit: string | null
  nombreOptica: string | null
  phone: string | null
  tangoCode: string | null
  status: B2bStatus
  rejectReason: string | null
  reviewedBy: number | null
  reviewedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateB2bUserPayload {
  email: string
  password: string
  name: string
  tangoCode: string
  razonSocial?: string
  cuit?: string
  nombreOptica?: string
  phone?: string
}

export type UpdateB2bUserPayload = Partial<
  Pick<CreateB2bUserPayload, 'name' | 'razonSocial' | 'cuit' | 'nombreOptica' | 'phone' | 'tangoCode'>
>
