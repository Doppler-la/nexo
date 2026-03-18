import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section id="inicio" className="bg-background py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl lg:text-6xl">
            Conectá Tango con tu tienda, sin complicaciones
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Nexo es el middleware que sincroniza tus productos, precios por cliente y pedidos entre Tango Gestión y tu tienda — en tiempo real, sin intervención manual.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="#contacto">
                Empezar ahora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link href="#como-funciona">Ver cómo funciona</Link>
            </Button>
          </div>
        </div>

        {/* Integration Diagram */}
        <div className="mt-16 md:mt-20">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <div className="flex h-20 w-48 items-center justify-center rounded-lg border-2 border-primary bg-primary/5 px-6 py-4">
              <span className="text-center text-sm font-semibold text-primary">Tango Gestión</span>
            </div>
            <div className="flex items-center">
              <div className="hidden h-0.5 w-8 bg-accent sm:block" />
              <div className="h-8 w-0.5 bg-accent sm:hidden" />
              <ArrowRight className="hidden h-5 w-5 text-accent sm:block" />
              <div className="block rotate-90 sm:hidden">
                <ArrowRight className="h-5 w-5 text-accent" />
              </div>
              <div className="hidden h-0.5 w-8 bg-accent sm:block" />
              <div className="h-8 w-0.5 bg-accent sm:hidden" />
            </div>
            <div className="flex h-20 w-32 items-center justify-center rounded-lg border-2 border-accent bg-accent/10 px-6 py-4">
              <span className="text-center text-sm font-bold text-accent">Nexo</span>
            </div>
            <div className="flex items-center">
              <div className="hidden h-0.5 w-8 bg-accent sm:block" />
              <div className="h-8 w-0.5 bg-accent sm:hidden" />
              <ArrowRight className="hidden h-5 w-5 text-accent sm:block" />
              <div className="block rotate-90 sm:hidden">
                <ArrowRight className="h-5 w-5 text-accent" />
              </div>
              <div className="hidden h-0.5 w-8 bg-accent sm:block" />
              <div className="h-8 w-0.5 bg-accent sm:hidden" />
            </div>
            <div className="flex h-20 w-48 items-center justify-center rounded-lg border-2 border-primary bg-primary/5 px-6 py-4">
              <span className="text-center text-sm font-semibold text-primary">WooCommerce</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
