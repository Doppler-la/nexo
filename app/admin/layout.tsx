"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuthStore } from "@/src/store/authStore"
import { useAppInit } from "@/src/hooks/useAppInit"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router          = useRouter()
  const { initialized } = useAppInit()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const role             = useAuthStore((s) => s.user?.role)
  const clearAuth        = useAuthStore((s) => s.clearAuth)

  const handleLogout = () => {
    clearAuth()
    router.replace('/login')
  }

  useEffect(() => {
    if (!initialized) return
    if (!isAuthenticated) {
      router.replace('/login')
      return
    }
    if (role !== 'admin') {
      router.replace('/dashboard')
    }
  }, [initialized, isAuthenticated, role, router])

  // Mientras carga, no mostrar nada (evita flash de redirect)
  if (!initialized) return null

  // No autenticado, o autenticado pero no admin — esperar redirect
  if (!isAuthenticated || role !== 'admin') return null

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/admin" className="text-xl font-bold text-primary">
            Nexo <span className="text-sm font-normal text-muted-foreground">/ Administrador</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
