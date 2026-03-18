"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [company, setCompany] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem("nexo_token")
    const storedCompany = localStorage.getItem("nexo_company")

    if (!token) {
      router.push("/login")
      return
    }

    setCompany(storedCompany || "Mi Empresa")
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("nexo_token")
    localStorage.removeItem("nexo_company")
    router.push("/login")
  }

  if (!mounted) {
    return null
  }

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
              className="text-muted-foreground hover:text-foreground"
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
