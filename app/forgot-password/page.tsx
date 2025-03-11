"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageBackground from "@/lib/globals/PageBackground";
import ServiceFeatures from "@/lib/globals/ServiceFeatures";
import toastMessage from "@/lib/globals/ToastMessage";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      setEmailSent(true);
      toastMessage("success", data.message);
    } catch (error) {
      toastMessage(
        "error",
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <PageBackground />
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="w-full">
          <ServiceFeatures />
        </div>
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-full max-w-md p-8 glass-panel rounded-lg">
            <h1 className="text-2xl font-bold text-primary text-center mb-6">
              Réinitialisation du mot de passe
            </h1>

            {emailSent ? (
              <div className="text-center">
                <p className="text-green-600 mb-4">
                  Un email a été envoyé avec les instructions de
                  réinitialisation.
                </p>
                <a href="/login" className="text-primary hover:underline">
                  Retour à la connexion
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Entrez votre email"
                    required
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full text-white"
                  disabled={loading}
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Envoyer le lien de réinitialisation
                </Button>

                <Link href="/" className="w-full ">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-2"
                    disabled={loading}
                  >
                    Retour à l&apos;accueil
                  </Button>
                </Link>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
