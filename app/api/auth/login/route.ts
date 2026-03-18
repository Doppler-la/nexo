import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Simple mock authentication for now
    // In production, this would validate against a real auth system
    if (email && password) {
      // Generate a simple token (in production, use proper JWT)
      const token = Buffer.from(`${email}:${Date.now()}`).toString("base64")
      
      return NextResponse.json({
        token,
        company: "Mi Empresa S.A.",
        message: "Login exitoso",
      })
    }

    return NextResponse.json(
      { message: "Credenciales inválidas" },
      { status: 401 }
    )
  } catch {
    return NextResponse.json(
      { message: "Error en el servidor" },
      { status: 500 }
    )
  }
}
