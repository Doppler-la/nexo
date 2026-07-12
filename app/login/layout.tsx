'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/src/store/authStore";


export default function LoginLayout({
    children,
}: { children: React.ReactNode }) {
    const router = useRouter()
    
    const { isAuthenticated, user } = useAuthStore()
    useEffect(() => {
        if (isAuthenticated) {
          router.replace(user?.role === 'admin' ? '/admin' : '/dashboard')
        }
      }, [isAuthenticated, user, router])
    return children;
}
