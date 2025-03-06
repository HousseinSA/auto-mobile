import "./styles/globals.css"
import Providers from "@/lib/globals/Providers"
import WhatsAppButton from "@/lib/globals/WhatsAppButton"

export const metadata = {
  title: "Toyota ECU SERVICES",
  description:
    "Toyota ECU SERVICES se spécialise dans le tuning des unités de contrôle moteur (ECU) pour les véhicules Toyota. Nous offrons des solutions personnalisées pour optimiser les performances, le diagnostic et la personnalisation de votre voiture. Profitez d'une expertise professionnelle pour améliorer l'efficacité et la puissance de votre Toyota.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body className="min-h-screen bg-neutral-50/80">
        <Providers>
          <main className="relative z-10 mx-auto">{children}</main>
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  )
}
