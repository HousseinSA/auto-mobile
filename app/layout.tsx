import "./styles/globals.css";
import Providers from "@/lib/globals/Providers";
export const metadata = {
  title: "Car Auto Tunning Service",
  description: "Car Auto Tunning Service est votre spécialiste en personnalisation et optimisation automobile. Nous proposons des services professionnels de tuning, diagnostic et amélioration des performances pour tous types de véhicules.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body>
        <Providers>
          <main className="mx-auto">{children}</main>
        </Providers>
      </body>
    </html>
  );
}