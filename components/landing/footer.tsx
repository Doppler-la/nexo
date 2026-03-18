import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <Link href="/" className="text-xl font-bold text-primary">
              Nexo
            </Link>
            <p className="text-sm text-muted-foreground">
              Conectando Tango con el mundo digital.
            </p>
          </div>
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Iniciar sesión
          </Link>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Nexo. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
