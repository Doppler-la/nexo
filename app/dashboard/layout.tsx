"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuthStore } from "@/src/store/authStore"
import { useHydratedAuth } from "@/src/hooks/useHydratedAuth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated } = useHydratedAuth()
  const company         = useAuthStore((s) => s.user?.nameSrl)
  const clearAuth       = useAuthStore((s) => s.clearAuth)
  const [ready, setReady] = useState(false)

  const handleLogout = () => {
    clearAuth()
    router.replace('/login')
  }

  useEffect(() => {
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.replace('/login')
    }
  }, [ready, isAuthenticated, router])

  if (!ready) return null
  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/dashboard" className="text-xl font-bold text-primary">
            Nexo
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {company}
            </span>
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
