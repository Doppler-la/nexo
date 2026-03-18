"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function Contact() {
  return (
    <section id="contacto" className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-2xl font-bold tracking-tight text-primary sm:text-3xl md:text-4xl">
            ¿Querés integrar tu negocio?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Contanos sobre tu operación y te mostramos cómo Nexo puede ayudarte.
          </p>
        </div>

        <form className="mx-auto mt-12 max-w-lg">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" placeholder="Tu nombre" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Input id="empresa" name="empresa" placeholder="Nombre de tu empresa" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mensaje">Mensaje</Label>
              <Textarea
                id="mensaje"
                name="mensaje"
                placeholder="Contanos sobre tu operación..."
                rows={4}
                required
              />
            </div>
            <Button type="submit" size="lg" className="w-full">
              Enviar mensaje
            </Button>
          </div>
        </form>

        <div className="mx-auto mt-8 max-w-lg text-center text-sm text-muted-foreground">
          <p>contacto@nexo.com.ar</p>
          <p className="mt-1">+54 11 1234-5678</p>
        </div>
      </div>
    </section>
  )
}
