'use client'

import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLogin } from '@/src/hooks/useAuth'

export default function LoginPage() {
  const { register, handleSubmit } = useForm()
  const { mutateAsync: login, isPending, error } = useLogin()

  const onSubmit = (data: any) => {
    login(data)
  }

  const errorMessage = error
    ? ((error as any)?.response?.data?.message ?? 'Email o contraseña incorrectos')
    : null

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex min-h-screen items-center justify-center bg-muted px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Link href="/" className="mx-auto mb-4 text-2xl font-bold text-primary">
              Nexo
            </Link>
            <CardTitle className="text-xl">Ingresá a tu cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  {...register('email', { required: 'Email es requerido' })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password', { required: 'Contraseña es requerida' })}
                />
              </div>

              {errorMessage && (
                <p className="text-sm text-destructive">{errorMessage}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">
                ← Volver al inicio
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}