import { UserCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { UserSettingsModal } from "../userSettingsModal/UserSettingsModal";
import { useState } from "react";
import { ConfirmModal } from "@/lib/globals/confirm-modal";

interface DashboardHeaderProps {
  username: string;
  displayName?: string | undefined | null;
}

export function DashboardHeader({
  username,
  displayName,
}: DashboardHeaderProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-8 border-b border-gray-200 bg-gradient-to-r from-primary/10 to-primary/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <UserCircle className="h-16 w-16 text-primary" />
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl  font-bold text-primary">
              <span className="hidden sm:inline">Tableau de bord de </span>
              {""}
              {displayName}
            </h2>
            <p className="text-gray-500 hidden sm:block">
              Gérez votre compte et vos paramètres
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UserSettingsModal username={username} />
          <Button
            onClick={() => setShowLogoutModal(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline-block">Déconnexion</span>
          </Button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        title="Confirmer la déconnexion"
        description="Êtes-vous sûr de vouloir vous déconnecter ?"
      />
    </div>
  );
}
