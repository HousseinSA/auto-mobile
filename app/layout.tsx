// app/layout.tsx
import "./styles/globals.css";
import { Toaster } from "react-hot-toast";

// Define metadata
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
        <Toaster />
        <main className="mx-auto">{children}</main>
      </body>
    </html>
  );
}