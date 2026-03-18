const steps = [
  {
    number: "01",
    title: "Conectamos tu Tango",
    description: "Sincronizamos tu catálogo, listas de precios y clientes desde Tango Gestión a nuestra base de datos local.",
  },
  {
    number: "02",
    title: "Cada cliente ve su precio",
    description: "Cuando un cliente mayorista entra a tu tienda, ve automáticamente los precios de su lista asignada en Tango.",
  },
  {
    number: "03",
    title: "Los pedidos llegan solos",
    description: "Al confirmar una compra en WooCommerce, el pedido se crea automáticamente en Tango con todos los datos del cliente.",
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-balance text-center text-2xl font-bold tracking-tight text-primary sm:text-3xl md:text-4xl">
          Cómo funciona Nexo
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-10 hidden h-0.5 w-full bg-border md:block" />
              )}
              <div className="relative flex flex-col items-center text-center">
                <div className="z-10 flex h-20 w-20 items-center justify-center rounded-full border-2 border-accent bg-background">
                  <span className="text-2xl font-bold text-accent">{step.number}</span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-primary">{step.title}</h3>
                <p className="mt-3 text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
