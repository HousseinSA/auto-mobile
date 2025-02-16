// app/layout.tsx
import "./styles/globals.css";
import { Toaster } from "react-hot-toast";

// Define metadata
export const metadata = {
  title: "Safaris-Center",
  description: "Safaris-Center est une application web permettant d'enregistrer les utilisateurs et de gérer la comptabilité des services proposés.",
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