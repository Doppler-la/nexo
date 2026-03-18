'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/src/store/authStore";


export default function LoginLayout({
    children,
}: { children: React.ReactNode }) {
    const router = useRouter()
    
    const { isAuthenticated } = useAuthStore()
    console.log('LoginLayout render - isAuthenticated:', isAuthenticated)
    useEffect(() => {
        if (isAuthenticated) {
          router.replace('/dashboard')
        }
      }, [isAuthenticated, router])
    return children;
}
