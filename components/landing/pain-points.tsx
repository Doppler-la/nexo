import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList, DollarSign, Package } from "lucide-react"

const painPoints = [
  {
    icon: ClipboardList,
    title: "Doble trabajo",
    description: "Cada pedido de tu tienda online tenés que cargarlo manualmente en Tango. Eso es tiempo y errores.",
  },
  {
    icon: DollarSign,
    title: "Precios desactualizados",
    description: "Tus clientes mayoristas ven precios genéricos, no los de su lista. Eso genera confusión y reclamos.",
  },
  {
    icon: Package,
    title: "Stock sin sincronía",
    description: "Tu tienda online muestra productos sin stock o precios desactualizados porque la info de Tango no llega automáticamente.",
  },
]

export function PainPoints() {
  return (
    <section className="bg-muted py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-balance text-center text-2xl font-bold tracking-tight text-primary sm:text-3xl md:text-4xl">
          ¿Cansado de cargar pedidos a mano?
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {painPoints.map((point) => (
            <Card key={point.title} className="border-none bg-background shadow-sm">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <point.icon className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-lg text-primary">{point.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{point.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
