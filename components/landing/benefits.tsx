import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Users, RefreshCw, Zap } from "lucide-react"

const benefits = [
  {
    icon: CheckCircle,
    title: "Cero carga manual",
    description: "Los pedidos de WooCommerce se crean solos en Tango. Tu equipo se enfoca en vender, no en cargar datos.",
  },
  {
    icon: Users,
    title: "Precios por cliente",
    description: "Cada mayorista ve exactamente los precios de su lista en Tango, sin configuración extra en WooCommerce.",
  },
  {
    icon: RefreshCw,
    title: "Sincronización automática",
    description: "Productos, precios y stock se actualizan automáticamente todos los días y en tiempo real ante cambios.",
  },
  {
    icon: Zap,
    title: "Fácil de implementar",
    description: "Sin plugins complejos ni desarrollos a medida. Nexo se integra con tu Tango y WooCommerce existentes.",
  },
]

export function Benefits() {
  return (
    <section id="beneficios" className="bg-muted py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-balance text-center text-2xl font-bold tracking-tight text-primary sm:text-3xl md:text-4xl">
          Por qué elegir Nexo
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="border-none bg-background shadow-sm">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <benefit.icon className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-lg text-primary">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{benefit.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
